from gpiozero import DistanceSensor
ultrasonic = DistanceSensor(echo=18, trigger=17, threshold_distance=0.1)
while True:
    ultrasonic.wait_for_in_range()
    print("In range")
    ultrasonic.wait_for_out_of_range()
    print("Out of range")