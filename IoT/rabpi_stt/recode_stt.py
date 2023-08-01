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
import queue, os
import sounddevice
import soundfile 
import requests
import aiohttp
import pyaudio
import wave
from playsound import playsound
import logging

logger=logging.getLogger("my_logger")
logger.setLevel(logging.DEBUG)

que=queue.Queue()
recorde_flag=False
thread_rec=False

# 초음파 센서 세팅
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
TRIG = 17
ECHO = 18
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

exit_flag=False

''' 
센서 값에 따라 전역변수 exit_flag의 값을 수정
True인 경우 녹음을 중단(거리가 멀어 질때)
'''
def sense():
    global exit_flag
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
            exit_flag=True
            time.sleep(1)
        # 가까운 경우
        else:
            # thread가 미존재시 생성 2.스레드 생성해 입력 받기
            print("close")
            exit_flag=False
            time.sleep(1)

'''
녹음을 무한루프로 저장,exit_flag입력시 루프의 종료,파일의 저장
'''
def rec():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    WAVE_OUTPUT_FILENAME = r'38_assistant\output.wav'
    
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print('음성녹음을 시작합니다.')
    frames = []

    try:
        while True:
            data = stream.read(CHUNK)
            frames.append(data)
            print(exit_flag,end=" ")

            if exit_flag:
                break

    except KeyboardInterrupt:
        pass

    finally:
        print("음성녹음을 종료합니다")
        stream.stop_stream()
        stream.close()
        p.terminate()

        wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b' '.join(frames))
        wf.close()

'''
파일의 경로,이름을 제공시 그 wav파일을 stt서버로 전달해 주고 
그 값을 string을 return
'''
async def naverstt(path):
	data=open(path,"rb")
	Lang="kor"
	URL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + Lang
	
	ID="client_id"
	Secret="client_pw"
	headers={
		"Content-Type": "application/octet-stream", # Fix
		"X-NCP-APIGW-API-KEY-ID": ID,
		"X-NCP-APIGW-API-KEY": Secret,
	}
	#post는 동기
	#response= await requests.post(URL,data=data,headers=headers)
	#session 비동기
	async with aiohttp.ClientSession() as session:  
		async with session.post(URL, data=data, headers=headers) as response:  # 비동기 HTTP 요청
			rescode = response.status

			if(rescode==200):
				return response.text
			else:
				return "empty response"

'''
String을 제공시 msg를 웹 소켓에게 전달
'''
async def send_and_recv(send_msg):
    global serial_num
    uri = "ws://i9c103.p.ssafy.io:30002/"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({"role": "handshake", "number": serial_num}))
        data = {"role": "gpt", "message": send_msg, "number": serial_num}
        await websocket.send(json.dumps(data))

        recv_msg = await websocket.recv()
        print(recv_msg)

async def main():
    thread_sense = threading.Thread(target=sense)
    thread_sense.start()
    try:
        
        while exit_flag == True:
            # 파일 전달 코드
            #thread_rec.join()
            text = await naverstt("/SUNGMIN/pi/test.wav")
            await send_and_recv(text)
        else:
            #thread_rec = threading.Thread(target=rec)
            #thread_rec.start()
            rec()
    except KeyboardInterrupt:
        GPIO.cleanup()
        thread_sense.join()

if __name__ == '__main__':
    asyncio.run(main())