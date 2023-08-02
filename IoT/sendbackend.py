#!/usr/bin/env python3
import serial
import requests
import json
import os
import time
import threading

class SerialReaderThread(threading.Thread):
    def __init__(self, ser):
        threading.Thread.__init__(self)
        self.ser = ser
        self.latest_data = None
        self.running = True

    def run(self):
        while self.running:
            if self.ser.in_waiting > 0:
                line = self.ser.readline().decode('utf-8').rstrip()
                self.latest_data = line.split()

    def stop(self):
        self.running = False

    def get_latest_data(self):
        return self.latest_data

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.flush()
    serial_reader = SerialReaderThread(ser)
    serial_reader.start()
    while True:
        if serial_reader.get_latest_data() is not None:
            splitsens = serial_reader.get_latest_data()

            print(splitsens)

            url = os.environ['BaseURL'] +':'+ os.environ['BE_PORT']+'/api/sensor'
            print(url)

            headers = {
                "Content-Type": "application/json"
            }

            temp = {
                'serial_number':'testtesttest',
                'temperature':float(splitsens[3]), 
                'moisture':float(splitsens[0]), 
                'light':float(splitsens[1])
            }
            data = json.dumps(temp)

            #response = requests.post(url, headers=headers, data=data)

            #print("response: ", response)
            #print("response.text: ", response.text)
            time.sleep(2)
    serial_reader.stop()
