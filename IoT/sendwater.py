#!/usr/bin/env python3
import serial
import requests
import json
import os
import time
import threading
import numpy as np

WINDOW_SIZE = 5  # The number of previous readings to use for the moving average
THRESHOLD = 20  # The rate of change above which we consider the data to have changed
DEBOUNCE_TIME = 30  # The number of seconds to ignore changes after a change has been detected
SENSOR_POST_INTERVAL = 30  # The number of seconds between POST requests to /api/sensor
def convert_to_percentage_m(value):
    min_value = 703
    max_value = 204
    percentage = ((value - min_value) / (max_value - min_value)) * 100
    return percentage
def convert_to_percentage_p(value):
    min_value = 688
    max_value = 4
    percentage = ((value - min_value) / (max_value - min_value)) * 100
    return percentage

class SerialReaderThread(threading.Thread):
    def __init__(self, ser):
        threading.Thread.__init__(self)
        self.ser = ser
        self.latest_data = None
        self.data_history = []
        self.last_change_time = 0
        self.running = True

    def run(self):
        while self.running:
            if self.ser.in_waiting > 0:
                line = self.ser.readline().decode('utf-8').rstrip()
                self.latest_data = line.split()
                self.data_history.append(float(self.latest_data[0]))
                if len(self.data_history) > WINDOW_SIZE:
                    self.data_history.pop(0)
            time.sleep(0.1)  # pause to reduce CPU usage

    def stop(self):
        self.running = False

    def get_latest_data(self):
        return self.latest_data

    def is_data_changed(self):
        if len(self.data_history) < WINDOW_SIZE:
            return False
        rate_of_change = np.diff(self.data_history).mean()
        if abs(rate_of_change) > THRESHOLD and time.time() - self.last_change_time > DEBOUNCE_TIME:
            self.last_change_time = time.time()
            return True
        return False

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.flush()
    serial_reader = SerialReaderThread(ser)
    serial_reader.start()
    last_sensor_post_time = 0
    while True:
        if serial_reader.get_latest_data() is not None:
            splitsens = serial_reader.get_latest_data()

            if serial_reader.is_data_changed():
                url = os.environ['BaseURL'] +':'+ os.environ['BE_PORT'] + "/api/sensor"
                temp = {'serial_number':'97745'}
                print(url)

                headers = {
                    "Content-Type": "application/json"
                }
                data = json.dumps(temp)

                response = requests.post(url, headers=headers, data=data)
            elif time.time() - last_sensor_post_time > SENSOR_POST_INTERVAL:
                url = os.environ['BaseURL'] +':'+ os.environ['BE_PORT'] + "/api/sensor"
                # url = 'http://192.168.100.37' +':'+ os.environ['BE_PORT'] + "/api/sensor"
                temp = {
                    'serial_number':'97745',
                    'temperature':float(splitsens[3]), 
                    'moisture':convert_to_percentage_m(float(splitsens[0])), 
                    'light':convert_to_percentage_p(float(splitsens[1]))
                }
                last_sensor_post_time = time.time()
                print(url)
                print(temp)

                headers = {
                    "Content-Type": "application/json"
                }
                data = json.dumps(temp)

                response = requests.put(url, headers=headers, data=data)
            else:
                continue

           

            print("response: ", response)
            print("response.text: ", response.text)

        time.sleep(0.1)  # pause to reduce CPU usage
    serial_reader.stop()
