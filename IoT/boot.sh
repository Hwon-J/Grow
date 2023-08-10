#!/bin/sh
lxterminal -e 'bash -c "python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/sendwater.py; read -n1"' &
sleep 1
lxterminal -e 'bash -c "python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/stt_Chirp/record.py; read -n1"' &
sleep 1
/usr/lib/chromium-browser/chromium-browser --start-maximized --kiosk http://i9c103.p.ssafy.io:3000/characterchoice &


#lxterminal -e  python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/sendwater.py &
#lxterminal -e  python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/stt_Chirp/record.py &
