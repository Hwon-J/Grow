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
ws = None

def on_message(ws, message):
    data = json.loads(message)
    
    recv_msg = data["content"]
    if recv_msg == 2:
        print("serialCheck")
    else:
        print(f"Received message from client: {recv_msg}")

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
    # ws_url = "ws://192.168.100.37:30002/"  # 원하는 주소로 변경 가능
    ws_url = "ws://i9c103.p.ssafy.io:30002/"  # 원하는 주소로 변경 가능

    ws = WebSocketApp(ws_url,
                      on_message=on_message,
                      on_error=on_error,
                      on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
# def send_mp3_file(ws,path):
#     mp3_file_path = path  # MP3 파일의 경로를 지정해주세요
#     chunk_size = 4096  # 전송할 데이터의 한 번에 보낼 크기 설정
#     if os.path.exists(mp3_file_path):
#         message = json.dumps({"purpose": "file", "role": "raspi",  "content": mp3_file_path[48:], "serial": "97745"})
#         ws.send(message)
#         with open(mp3_file_path, "rb") as mp3_file:
#             while True:
#                 chunk = mp3_file.read(chunk_size)
#                 chunk_base64 = base64.b64encode(chunk).decode()
#                 if not chunk:
#                     message3 = json.dumps({"purpose": "file_end", "role": "raspi", "serial": "97745"})   
#                     ws.send(message3)
#                     break
#                 print("전")
                
#                 message2 = json.dumps({"purpose": "file", "role": "raspi",  "content": chunk_base64, "serial": "97745"})   
#                 ws.send(message2)
#                 print("후")
#                 time.sleep(0.1)  # 너무 빠르게 전송하지 않도록 간격을 줍니다.
#     else:
#         print("MP3 file not found.")
def send_mp3_file(ws,path):
    mp3_file_path = path  # MP3 파일의 경로를 지정해주세요
    chunk_size = 4096  # 전송할 데이터의 한 번에 보낼 크기 설정
    if os.path.exists(mp3_file_path):
        message = json.dumps({"purpose": "file_start", "role": "raspi",  "content": mp3_file_path[49:], "serial": "97745"})
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
if __name__ == "__main__":

    file_path = "/home/jamfarm/HYOCHANG/S09P12C103/IoT/record_mp3/record_20230813_194432.mp3"
    websocket_thread = threading.Thread(target=run_websocket_server)
    websocket_thread.daemon = True
    websocket_thread.start()
    print(file_path[49:])
    time.sleep(1)
    
    send_mp3_file(ws,file_path)
    while True:
        time.sleep(1)
