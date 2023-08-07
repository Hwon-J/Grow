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

stack = []


def stream_generator(stream):
    while True:
        data = stream.read(CHUNK)
        yield data


async def send(websocket, send_msg):
    data = {"role": "gpt", "message": send_msg, "serial": 1111}
    await websocket.send(json.dumps(data))
    response = await websocket.recv()
    print(f"Received: {response}")


def listen_print_loop(responses):
    global send_msg, stack
    stack.append("test string")
    num_chars_printed = 0
    tmp = ""
    for response in responses:

        if not response.results:
            continue

        result = response.results[0]
        if not result.alternatives:
            continue

        transcript = result.alternatives[0].transcript

        overwrite_chars = ' ' * (num_chars_printed - len(transcript))

        if not result.is_final:
            stack.append(transcript + overwrite_chars)
            # stt와 sense모두 돌아가야함
            # sense가 가까워 지는경우 전역에 저장해 준뒤 보내줌
            # sense와의 연동
            # exit_flag true인 경우
            # string으로 보내주기
            # stack clear
            if start_flag.is_set():
                tmp = stack[-1]
                print("데이터 생성중", tmp)
                send_msg = tmp
            else:
                time.sleep(1)
                # stack.clear()
        else:
            # send_msg = stack.peek()
            # send_msg += tmp
            # stack.clear()
            pass


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

        if s_avg < 30:
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


def get_msg():
    global stack
    length = stack.size()-1
    print(type(stack))
    print(type(stack[0]))
    msg = ""
    for i in length(length, 1, -1):
        if (len(stack[i]) < len(stack[i-1])):
            msg += stack[i-1]
        elif (len(stack[i]) > len(stack[i-1])):
            pass
    return msg


async def main():

    global send_msg, stack

    # uri = "ws://192.168.100.37:30002/"
    uri = "ws://i9c103.p.ssafy.io:30002/"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({"role": "handshake", "serial": 1111}))
        print("server connect")

        thread_stt = threading.Thread(target=stt)
        thread_sense = threading.Thread(target=sense_filter)

        thread_stt.start()
        thread_sense.start()

        try:
            send_flag = False
            while True:
                if exit_flag.is_set() and not send_flag:
                    # send_msg = get_msg()
                    print("웹소켓 전송", send_msg)
                    await send(websocket, send_msg)
                    stack.clear()
                    send_flag = True
                elif not exit_flag.is_set():
                    send_flag = False
                time.sleep(2)
        except KeyboardInterrupt:
            GPIO.cleanup()
            thread_sense.join()
            thread_stt.join()
            sys.exit()


if __name__ == '__main__':
    # main()
    asyncio.run(main())
