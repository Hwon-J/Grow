import RPi.GPIO as GPIO
import sounddevice as sd
import wavio
import time
import threading
import numpy as np
from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech
from websocket import create_connection
from websocket._app import WebSocketApp
from statistics import mean, stdev, median
from gpiozero import DistanceSensor
import json
import datetime
import urllib.request
import os
import sys
import pygame
import subprocess
import base64
last_N_readings = [50, 50, 50, 50, 50]  # 마지막 N개의 측정값을 저장
# 웹소켓 서버 설정
ws = None

Quest=False
# 초음파 센서 설정
TRIG = 17
ECHO = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

# 녹음 설정
RATE = 48000  # 샘플링 레이트 줄임
CHANNELS = 1
BUFFER_SIZE = 60 * RATE # 60초 버퍼
buffer = np.zeros((BUFFER_SIZE, CHANNELS), dtype='int16')
write_ptr = 0
recording = False
save_data = False
playing=False
lock = threading.Lock()

def play(path):
    print("지금 재생중~~~~~~~~~~~~~~~~~~~~")
    try:
        subprocess.run(["aplay", path], check=True)
    except:
        print("오디오 출력 에러")
    #recode풀기
def tts(recv_msg):
    
    global playing
    client_id = "tzm493x2hf"
    client_secret = "KcnpCE2iHXwN7HLCKxoLLC12KM9TS6CZe7zNuzVF"
    encText = urllib.parse.quote(recv_msg)
    data = "speaker=vdain&volume=5&speed=-2&pitch=0&emotion=2&emotion-strength=1&format=wav&sampling-rate=48000&text=" + encText
    url = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID", client_id)
    request.add_header("X-NCP-APIGW-API-KEY", client_secret)
    response = urllib.request.urlopen(request, data=data.encode('utf-8'))
    rescode = response.getcode()
    try:
        if (rescode == 200):
            response_body = response.read()
            with open('tts.wav', 'wb') as f:
                f.write(response_body)
        else:
            print("Error Code:" + rescode)
    except:
        print("tts에러")
    path = "/home/jamfarm/HYOCHANG/S09P12C103/IoT/stt_Chirp/tts.wav"  # 실제 WAV 파일 경로로 수정해주세요'
    play(path)
    playing=False
    print(f"playing: {playing}")


# 웹소켓 서버 설정
def on_message(ws, message):
    global Quest
    data = json.loads(message)

    recv_msg = data["content"]
    if recv_msg == 2:
        print("serialCheck")
    else:
        print(message)
        Quest = data["isQuest"]
        print(f"Received message from client: {recv_msg}")
        print(f"Received isQuest from client: {Quest}")
        tts(recv_msg)

    # 클라이언트로부터 받은 메시지를 처리하는 로직을 여기에 추가
    # 예: message를 분석하고 필요한 동작을 수행


def on_error(ws, error):
    print(f"Error occurred: {error}")

def on_close(ws):
    print("WebSocket closed")

def on_open(ws):
    
    handshake_message = json.dumps({"purpose": "handshake" ,"role": "raspi", "serial": "97745"}) # 수정된 부분
    ws.send(handshake_message)
    print("WebSocket opened")

def run_websocket_server():
    global ws
    ws_url = "ws://192.168.100.37:30002/"  # 원하는 주소로 변경 가능
    # ws_url = "ws://i9c103.p.ssafy.io:30002/"  # 원하는 주소로 변경 가능

    ws = WebSocketApp(ws_url,
                      on_message=on_message,
                      on_error=on_error,
                      on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()

def send_mp3_file(ws,path):
    mp3_file_path = path  # MP3 파일의 경로를 지정해주세요
    chunk_size = 4096  # 전송할 데이터의 한 번에 보낼 크기 설정

    if os.path.exists(mp3_file_path):
        message = json.dumps({"purpose": "file_start", "role": "raspi",  "content": mp3_file_path[48:], "serial": "97745"})
        ws.send(message)
        with open(mp3_file_path, "rb") as mp3_file:
                file_data = mp3_file.read()
                file_base64 = base64.b64encode(file_data).decode()
                
                message2 = json.dumps({"purpose": "file", "role": "raspi",  "content": file_base64, "serial": "97745"})   
                ws.send(message2)
                
                message3 = json.dumps({"purpose": "file_end", "role": "raspi", "serial": "97745"})   
                ws.send(message3)
    else:
        print("MP3 file not found.")

def transcribe_file_v2(audio_file: str) -> cloud_speech.RecognizeResponse:
    # Instantiates a client
    client = SpeechClient()

    # Reads a file as bytes
    with open(audio_file, "rb") as f:
        content = f.read()

    config = cloud_speech.RecognitionConfig(
        auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
        language_codes=["ko-KR"],
        model="long",
        features=cloud_speech.RecognitionFeatures(
            enable_automatic_punctuation=True,
        ),
    )

    request = cloud_speech.RecognizeRequest(
        recognizer="projects/abstract-veld-385000/locations/global/recognizers/_",  # 여기에 프로젝트 ID 입력
        config=config,
        content=content,
    )

    # Transcribes the audio into text
    response = client.recognize(request=request)
    returntext = ""
    for result in response.results:
        print(f"Transcript: {result.alternatives[0].transcript}")
        returntext += result.alternatives[0].transcript

    return returntext


def record_audio():
    global write_ptr
    global recording
    global save_data
    global ws
    global Quest
    global playing
    start_ptr = 0
    end_ptr = 0

    with sd.InputStream(samplerate=RATE, channels=CHANNELS, dtype='int16') as stream:
        global playing
        while True:
            try:
                data, _ = stream.read(RATE)
            except sounddevice.PortAudioError as e:
                print(f"스트림에서 읽는 도중 오류 발생: {e}")
            lock.acquire()
            if recording:
                if write_ptr == 0:
                    start_ptr = 0
                buffer[write_ptr:write_ptr + len(data)] = data
                write_ptr = (write_ptr + len(data)) % BUFFER_SIZE
            elif save_data:
                end_ptr = write_ptr
                if start_ptr <= end_ptr:
                    save_buffer = buffer[start_ptr:end_ptr]
                else: # 순환 버퍼 처리
                    save_buffer = np.concatenate((buffer[start_ptr:], buffer[:end_ptr]))
                
                now = datetime.datetime.now()
                time_string = now.strftime("%Y%m%d_%H%M%S")
                file_name = f"record_{time_string}.mp3"  # 예: record_20230812_153025.mp3
                file_path = os.path.join("/home/jamfarm/SUNGMIN/S09P12C103/IoT/record_mp3", file_name)
                wavio.write(file_path, save_buffer, RATE, sampwidth=2)
                response = transcribe_file_v2(file_path)  # 파일 저장 후 변환 함수 호출, mp3변환
                print(response)
                print("stt전송 완료")
                if response=="" or response==None or response==" ":
                    playing = False
                elif ws:
                    if Quest:
                        send_mp3_file(ws,file_path)
                        print("send mp3")
                        Quest=False
                    message = json.dumps({"purpose": "gpt", "role": "raspi",  "content": response, "serial": "97745"})  # 수정된 부분
                    ws.send(message)
                os.remove(file_path)
                save_data = False
                write_ptr = 0
            lock.release()

def measure_distance():
    global last_N_readings, ECHO, TRIG
    # sensor = DistanceSensor(echo=ECHO, trigger=TRIG)
    GPIO.output(TRIG, False)
    time.sleep(0.1)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    start_time = time.time()
    stop_time = time.time()

    while GPIO.input(ECHO) == 0:
        start_time = time.time()

    while GPIO.input(ECHO) == 1:
        stop_time = time.time()

    elapsed_time = stop_time - start_time
    distance = (elapsed_time * 34300) / 2
    # distance = sensor.distance * 100
    # time.sleep(1)
    # 거리가 600 이상이면 무시하고 이전 측정값을 반환

    if distance >= 600:
        print("Ignoring outlier")
        if last_N_readings:
            return last_N_readings[-1]
        else:
            return 0 # 또는 적절한 기본값

    # 마지막 N개의 측정값을 업데이트
    if len(last_N_readings) >= 5: # N=5
        last_N_readings.pop(0)
    last_N_readings.append(distance)

    
    return median(last_N_readings)
    # return distance

if __name__ == "__main__":


    try:
        print("Distance measurement is starting...")

        # 녹음 스레드 시작
        

        websocket_thread = threading.Thread(target=run_websocket_server)
        websocket_thread.daemon = True
        websocket_thread.start()
        time.sleep(0.1)
        record_thread = threading.Thread(target=record_audio)
        record_thread.daemon = True
        record_thread.start()
        last_status=None
        while True:
            if playing:
                pass
            else:
                distance = measure_distance()
                print(f"Distance: {distance} cm")
                lock.acquire()

                if distance < 15 and not recording: # 거리가 10cm 미만일 때 녹음 시작
                    print("Recording started...")
                    message = json.dumps({"purpose": "hear" ,"role": "raspi", "serial": "97745"}) # 수정된 부분
                    ws.send(message)
                    recording = True
                    last_status="hear"

                elif distance < 30 and last_status != "hear":
                    message = json.dumps({"purpose": "closer" ,"role": "raspi", "serial": "97745"})
                    ws.send(message)
                
                elif distance >= 30: # 거리가 10cm 이상일 때 녹음 종료
                    message = json.dumps({"purpose": "further" ,"role": "raspi", "serial": "97745"}) # 수정된 부분
                    ws.send(message)
                    if recording:
                        print("Recording stopped...")   
                        recording = False
                        save_data = True
                        playing=True
                        print(f"playing: {playing}")
                        last_status="further"

                
                lock.release()

            time.sleep(0.1) # 0.1초 간격으로 거리 측정

    except KeyboardInterrupt:
        print("Measurement stopped by user.")
        GPIO.cleanup()
