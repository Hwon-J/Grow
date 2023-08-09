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
from statistics import mean, stdev
import os
import sys
import urllib.request
import pygame
import time
import json
import logging
import subprocess




# 초음파 센서 설정
TRIG = 17
ECHO = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

# 녹음 설정
RATE = 48000  # 샘플링 레이트 줄임
CHANNELS = 1
BUFFER_SIZE = 60 * RATE  # 60초 버퍼
buffer = np.zeros((BUFFER_SIZE, CHANNELS), dtype='int16')
write_ptr = 0
recording = False
save_data = False
playing=False

# log 설정
logging.basicConfig(
    format='%(asctime)s %(levelname)s: %(message)s',
    filename="grow.log",
    level=logging.INFO
)

# 웹소켓 서버 설정
ws = None

last_N_readings = [50, 50, 50, 50, 50]  # 마지막 N개의 측정값을 저장

def play(path):
    global playing
    playing=True
    try:
        subprocess.run(["aplay", path], check=True)
        playing=False
    except:
        logging.warning("오디오 출력 에러")

def tts(message):
    logging.warning("tts 시작")
    client_id = "tzm493x2hf"
    client_secret = "KcnpCE2iHXwN7HLCKxoLLC12KM9TS6CZe7zNuzVF"
    encText = urllib.parse.quote(message)
    data = "speaker=vdain&volume=5&speed=-2&pitch=0&emotion=2&emotion-strength=1&format=wav&sampling-rate=48000&text=" + encText
    url = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID", client_id)
    request.add_header("X-NCP-APIGW-API-KEY", client_secret)
    response = urllib.request.urlopen(request, data=data.encode('utf-8'))
    rescode = response.getcode()
    try:
        if (rescode == 200):
            logging.info("TTS mp3저장")
            response_body = response.read()
            with open('tts.wav', 'wb') as f:
                f.write(response_body)
        else:
            print("Error Code:" + rescode)
            logging.error("TTS 에러발생")
        logging.warning("TTS 종료")
    except:
        logging.warning("TTS 에러발생")

    path = "/home/jamfarm/SUNGMIN/S09P12C103/IoT/tts.wav"  # 실제 WAV 파일 경로로 수정해주세요
    play(path)


# 웹소켓 서버 설정
def on_message(ws, message):
    try:
        data = json.loads(message)
        message = data["content"]
        
        print(f"Received message from client: {message}")
        logging.info(f"Received message from client: {message}")
        tts(message)

        # 클라이언트로부터 받은 메시지를 처리하는 로직을 여기에 추가
        # 예: message를 분석하고 필요한 동작을 수행
    except:
        logging.warning("not exist content")



def on_error(ws, error):
    #print(f"Error occurred: {error}")
    logging.error(f"Error occurred: {error}")

def on_close(ws):
    #print("WebSocket closed")
    logging.info("WebSocket closed")


def on_open(ws):

    handshake_message = json.dumps(
        {"purpose": "handshake", "role": "raspi", "serial": "97745"})  # 수정된 부분
    ws.send(handshake_message)
    #print("WebSocket opened")
    logging.info("WebSocket opened")
    
    # tts로 handshake시 읽어주기
    


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
        # print(f"Transcript: {result.alternatives[0].transcript}")
        returntext += result.alternatives[0].transcript

    return returntext


def record_audio():
    global write_ptr
    global recording
    global save_data
    global playing
    start_ptr = 0
    end_ptr = 0
    with sd.InputStream(samplerate=RATE, channels=CHANNELS, dtype='int16') as stream:
        while True:      
            try:
                data, _ = stream.read(RATE)
            except sd.PortAudioError as e:
                logging.error("스트링 읽기 에러발생")
            if recording:
                if write_ptr == 0:
                    start_ptr = 0
                buffer[write_ptr:write_ptr + len(data)] = data
                write_ptr = (write_ptr + len(data)) % BUFFER_SIZE
            elif save_data:
                end_ptr = write_ptr
                if start_ptr <= end_ptr:
                    save_buffer = buffer[start_ptr:end_ptr]
                else:  # 순환 버퍼 처리
                    save_buffer = np.concatenate(
                        (buffer[start_ptr:], buffer[:end_ptr]))
                wavio.write("recorded_audio.wav",
                            save_buffer, RATE, sampwidth=2)
                #print("File saved.")
                response = transcribe_file_v2(
                    "recorded_audio.wav")  # 파일 저장 후 변환 함수 호출
                if(response==""):
                    continue
                print(response)
                logging.info(response)
                logging.info("stt 완료")
                if ws:
                    message = json.dumps(
                        {"purpose": "gpt", "role": "raspi",  "content": response, "serial": "97745"})  # 수정된 부분
                    ws.send(message)
                    logging.info("stt 전송 완료")
                save_data = False
                write_ptr = 0


def measure_distance():
    global last_N_readings
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

    # 거리가 600 이상이면 무시하고 이전 측정값을 반환
    if distance >= 600:
        print("Ignoring outlier")
        if last_N_readings:
            return last_N_readings[-1]
        else:
            return 0  # 또는 적절한 기본값

    # 마지막 N개의 측정값을 업데이트
    if len(last_N_readings) >= 5:  # N=5
        last_N_readings.pop(0)
    last_N_readings.append(distance)

    return distance


if __name__ == "__main__":
    try:
        print("Distance measurement is starting...")

        # 녹음 스레드 시작
        record_thread = threading.Thread(target=record_audio)
        record_thread.daemon = True
        record_thread.start()
        websocket_thread = threading.Thread(target=run_websocket_server)
        websocket_thread.daemon = True
        websocket_thread.start()

        while True:
            distance = measure_distance()
            print(f"Distance: {distance} cm")
            logging.info(f"Distance: {distance} cm")

            if distance < 15 and not recording:  # 거리가 10cm 미만일 때 녹음 시작
                #print("Recording started...")
                logging.info("Recording started")
                message = json.dumps(
                    {"purpose": "closer", "role": "raspi", "serial": "97745"})  # 수정된 부분
                ws.send(message)
                recording = True

            elif distance >= 15 and recording:  # 거리가 10cm 이상일 때 녹음 종료
                #print("Recording stopped...")
                logging.info("Recording stopped")
                message = json.dumps(
                    {"purpose": "further", "role": "raspi", "serial": "97745"})  # 수정된 부분
                ws.send(message)
                recording = False
                save_data = True

            time.sleep(0.1)  # 0.1초 간격으로 거리 측정

    except KeyboardInterrupt:
        print("Measurement stopped by user.")
        GPIO.cleanup()
        logging.info("____________________________________________")
        exit()



