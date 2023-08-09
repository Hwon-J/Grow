import subprocess


def play(path):
    global playing
    playing=True
    try:
        subprocess.run(["aplay", path], check=True)
        playing=False
    except:
        print("error")
path = "/home/jamfarm/SUNGMIN/S09P12C103/IoT/tts.wav"  # 실제 WAV 파일 경로로 수정해주세요
play(path)
