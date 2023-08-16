#!/bin/sh
lxterminal -e 'bash -c "export BaseURL=http://i9c103.p.ssafy.io; export BE_PORT=30001; python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/sendwater.py; read -n1"' &
sleep 1
lxterminal -e 'bash -c "export BaseURL=http://i9c103.p.ssafy.io; export BE_PORT=30001; python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/stt_Chirp/record.py; read -n1"' &
sleep 1
/usr/lib/chromium-browser/chromium-browser --start-maximized --kiosk http://i9c103.p.ssafy.io:3000/characterchoice &


#lxterminal -e  python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/sendwater.py &
#lxterminal -e  python3 /home/jamfarm/HYOCHANG/S09P12C103/IoT/stt_Chirp/record.py &
