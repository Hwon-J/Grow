
import os
import sys
import urllib.request
import playsound

def tts(recv_msg):
    client_id = "tzm493x2hf"
    client_secret = "KcnpCE2iHXwN7HLCKxoLLC12KM9TS6CZe7zNuzVF"
    encText = urllib.parse.quote(recv_msg)
    data = "speaker=nara&volume=0&speed=0&pitch=0&format=mp3&text=" + encText;
    url = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID",client_id)
    request.add_header("X-NCP-APIGW-API-KEY",client_secret)
    response = urllib.request.urlopen(request, data=data.encode('utf-8'))
    rescode = response.getcode()
    if(rescode==200):
        print("TTS mp3 저장")
        response_body = response.read()
        with open('1111.mp3', 'wb') as f:
            f.write(response_body)
        playsound.playsound('1111.mp3')
    else:
        print("Error Code:" + rescode)
msg="피자가 먹고 싶군"
tts(msg)