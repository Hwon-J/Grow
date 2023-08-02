import io
import os
import pyaudio
import google.cloud.speech
import sys
import RPi.GPIO as GPIO
import time
import threading
import asyncio
import websockets
import json
import serial
import requests
from multiprocessing import Process
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/jamfarm/Downloads/strong-aegis-385000-84625bb4880b.json"

# 초음파 센서 세팅
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
TRIG = 17
ECHO = 18
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms

uw = 0
start_flag = threading.Event()
exit_flag = threading.Event()

send_msg = ""
serial_num = 1111


class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        else:
            print("Stack is empty. Cannot pop.")

    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        else:
            print("Stack is empty. Nothing to peek.")

    def size(self):
        return len(self.items)

    def clear(self):
        self.items = []


def stream_generator(stream):
    while True:
        data = stream.read(CHUNK)
        yield data


async def send(websocket, send_msg):
    data = {"role": "gpt", "message": send_msg, "number": 1111}
    await websocket.send(json.dumps(data))
    response = await websocket.recv()
    print(f"Received: {response}")


def listen_print_loop(responses):
    global send_msg
    stack = Stack()
    stack.push("test string")
    num_chars_printed = 0
    for response in responses:

        if not response.results:
            continue

        result = response.results[0]
        if not result.alternatives:
            continue

        transcript = result.alternatives[0].transcript

        overwrite_chars = ' ' * (num_chars_printed - len(transcript))

        if not result.is_final:
            stack.push(transcript + overwrite_chars)
            # stt와 sense모두 돌아가야함
            # sense가 가까워 지는경우 전역에 저장해 준뒤 보내줌
            # sense와의 연동
            # exit_flag true인 경우
            # string으로 보내주기
            # stack clear
            if start_flag.is_set():
                send_msg = stack.peek()
                # print("데이터 생성중",send_msg)
            else:
                time.sleep(1)
                stack.clear()
        else:
            send_msg = stack.peek()
            send_msg = ""
            stack.clear()
            # print("생성된 데이터",send_msg)


def stt():
    client = google.cloud.speech.SpeechClient()

    config = google.cloud.speech.RecognitionConfig(
        encoding=google.cloud.speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code='ko-KR',
        enable_automatic_punctuation=True,
        enable_spoken_punctuation=True,
        model='latest_long',
    )

    streaming_config = google.cloud.speech.StreamingRecognitionConfig(
        config=config,
        interim_results=True,
    )

    p = pyaudio.PyAudio()

    # 어떻게 넣을지
    Speaker_diarization_config = google.cloud.speech.SpeakerDiarizationConfig(
        min_speaker_count=1,
        max_speaker_count=1,
    )

    stream = p.open(
        format=pyaudio.paInt16,
        channels=1,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK,
    )

    audio_generator = stream_generator(stream)
    requests = (
        google.cloud.speech.StreamingRecognizeRequest(audio_content=content)
        for content in audio_generator
    )

    responses = client.streaming_recognize(streaming_config, requests)

    listen_print_loop(responses)


def sense():
    GPIO.output(17, False)
    time.sleep(0.5)

    GPIO.output(17, True)
    time.sleep(0.00001)
    GPIO.output(17, False)

    while GPIO.input(18) == 0:
        start = time.time()

    while GPIO.input(18) == 1:
        stop = time.time()

    time_interval = stop - start
    uw = time_interval * 17000
    uw = round(uw, 2)
    print(uw, end=" ")
    return uw


def sense_filter():
    k = 1
    s_meas = sense()
    s_avg = s_meas
    while True:
        alpha = (k-1)/k
        s_meas = sense()
        if s_meas > 500:
            continue
        s_avg = alpha*s_avg+(1-alpha)*s_meas

        if s_avg < 60:
            print("close ")
            # 여기서 sleep을 할 경우 스레드가 멈춰있어서 계속 측정하는것이 아님
            # stt에 sleep을 넣어주어서 확인해야함
            start_flag.set()
            exit_flag.clear()
            k += 1
        else:
            print("remote ")
            start_flag.clear()
            exit_flag.set()
            s_avg = s_meas
            k = 1


async def main():

    global send_msg

    # uri = "ws://192.168.100.37:30002/"
    uri = "ws://i9c103.p.ssafy.io:30002/"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({"role": "handshake", "number": 1111}))
        print("server connect")

        thread_stt = threading.Thread(target=stt)
        thread_sense = threading.Thread(target=sense_filter)

        thread_stt.start()
        thread_sense.start()

        try:
            send_flag = False
            while True:
                if exit_flag.is_set() and not send_flag:
                    print("웹소켓 전송", send_msg)
                    await send(websocket, send_msg)
                    send_flag = True
                elif not exit_flag.is_set():
                    send_flag = False
                time.sleep(2)
        except KeyboardInterrupt:
            GPIO.cleanup()
            thread_sense.join()
            thread_stt.join()

if __name__ == '__main__':
    # main()
    asyncio.run(main())
