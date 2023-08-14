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
import numpy as np
import statistics
from sklearn.linear_model import LinearRegression
import datetime

def play(path):
    global playing,recording
    try:
        subprocess.run(["aplay", path], check=True)
    except:
        logging.warning("오디오 출력 에러")
    playing = True
    logging.warning("tts 종료")

def tts(message):
    
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
            logging.info("tts wav저장")
            response_body = response.read()
            with open('tts.wav', 'wb') as f:
                f.write(response_body)
        else:
            print("Error Code:" + rescode)
            logging.error("tts 에러발생")
    except:
        logging.warning("tts 에러발생")

    path = "/home/jamfarm/SUNGMIN/S09P12C103/IoT/tts.wav"  # 실제 WAV 파일 경로로 수정해주세요
    play(path)

tts('mp3 문제')