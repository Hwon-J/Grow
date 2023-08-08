
import os
import sys
import urllib.request
import pygame
import time

pygame.init()
pygame.mixer.init()


def tts(recv_msg):

    client_id = "tzm493x2hf"
    client_secret = "KcnpCE2iHXwN7HLCKxoLLC12KM9TS6CZe7zNuzVF"
    encText = urllib.parse.quote(recv_msg)
    data = "speaker=nara&volume=0&speed=0&pitch=0&format=wav&sampling-rate=48000&text=" + encText
    url = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID", client_id)
    request.add_header("X-NCP-APIGW-API-KEY", client_secret)
    response = urllib.request.urlopen(request, data=data.encode('utf-8'))
    rescode = response.getcode()
    if (rescode == 200):
        print("TTS mp3 저장")
        response_body = response.read()
        with open('tts.wav', 'wb') as f:
            f.write(response_body)

        audio_file = "/home/jamfarm/SUNGMIN/S09P12C103/tts.wav"  # 실제 WAV 파일 경로로 수정해주세요
        pygame.mixer.init()
        sound = pygame.mixer.Sound(audio_file)
        sound.play()
        while pygame.mixer.get_busy():
            print("음성출력중")
            time.sleep(0.1)
        pygame.mixer.quit()

    else:
        print("Error Code:" + rescode)


msg = "이것은 테스트를 위한 코드야"
tts(msg)
