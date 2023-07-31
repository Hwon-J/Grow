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
#exit_flag = False  # 종료 여부를 확인하기 위한 플래그
exit_flag=threading.Event()
send_msg=""
serial_num=1111

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

stack=Stack()

def stream_generator(stream):
    while True:
        data = stream.read(CHUNK)
        yield data

def send_and_receive_message(send_msg):
    uri = "ws://i9c103.p.ssafy.io:30002/"
    websocket=websockets.connect(uri)
    
    print("msg sending")
    websocket.send(json.dumps({"role":"handshake", "number":1111}))
    data = {"role": "gpt","message": send_msg, "number": 1111}
    websocket.send(json.dumps(data))

    # Receive and immediately print the response
    response = websocket.recv()
    print(f"Received: {response}")

def listen_print_loop(responses):
    send_msg=""
    stack.push("test string")
    num_chars_printed = 0
    for response in responses:
        #print(stack.pop())
                    
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
            if exit_flag.is_set():
                send_msg=stack.peek()
                print(send_msg)
                
        else:
            print("send message is ",send_msg,end=" ")
            print()
            send_msg=""
            stack.clear()
                
def stt():
    global uw, exit_flag
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
    Speaker_diarization_config=google.cloud.speech.SpeakerDiarizationConfig(
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
    global uw, exit_flag
    while True:
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
        print(uw,end=" ")
        
        # 먼 경우
        if uw > 100:
            # thread가 존재 할때 종료 3. 멀어졌을때 종료하고 초기화
            print("remote")
            exit_flag.set()
        # 가까운 경우
        else:
            # thread가 미존재시 생성 2.스레드 생성해 입력 받기
            print("close")
            exit_flag.clear()


def main():

        global send_msg
        thread_stt = threading.Thread(target=stt)
        thread_sense = threading.Thread(target=sense)

        thread_stt.start()
        thread_sense.start()


        try:
            while True:
                '''
                if exit_flag.is_set():
                    thread_msg=threading.Thread(target=send_and_receive_message,args=(send_msg,))
                    thread_msg.start()
                    send_msg=""
                    thread_msg.join()
                time.sleep(1)
                '''
        except KeyboardInterrupt:
            GPIO.cleanup()
            thread_sense.join()
            thread_stt.join()

if __name__ == '__main__':
    main()

