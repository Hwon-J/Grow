import asyncio
import websockets
import json
import logging

serial_num = "qwer"

# 설정할 로그 파일 경로
LOG_FILE_PATH = "/home/jamfarm/SUNGMIN/S09P12C103/IoT/rabpi_stt/logfile.log"

# 로거 생성
logger = logging.getLogger("websocket_logger")
logger.setLevel(logging.DEBUG)

# 파일 핸들러 추가
file_handler = logging.FileHandler(LOG_FILE_PATH)
file_handler.setLevel(logging.DEBUG)

# 로그 포맷 지정
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# 핸들러를 로거에 추가
logger.addHandler(file_handler)


async def main():
    logger.info("start")
    
if __name__ == "__main__":
    main()
