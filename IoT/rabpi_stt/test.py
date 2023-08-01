import pyaudio
import wave
from playsound import playsound

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
WAVE_OUTPUT_FILENAME = r'38_assistant\output.wav'

def start():
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

    #except KeyboardInterrupt:
    except:
        stream.stop_stream
        stream.close
        p.terminate

    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b' '.join(frames))
    wf.close()

    print('녹음된 파일을 재생합니다.')
    playsound(WAVE_OUTPUT_FILENAME)

if __name__ == '__main__':
    start()
