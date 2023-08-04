from websocket import create_connection
import json

def run_websocket_client():
    ws_url = "ws://192.168.100.37:30002"  # 서버의 주소와 포트로 변경 가능
    ws = create_connection(ws_url)

    # 핸드셰이크 메시지 전송
    handshake_message = json.dumps({"role": "handshake", "serial": "qwer"})
    ws.send(handshake_message)
    print("WebSocket opened and handshake message sent")

    try:
        while True:
            user_input = input("Enter a message to send to the server: ")
            message = json.dumps({"role": "gpt", "message": user_input, "serial": "qwer"}) # 수정된 부분
            ws.send(message)
            response = ws.recv()
            print(f"Received response from server: {response}")
    except KeyboardInterrupt:
        print("Exiting client...")
    finally:
        ws.close()

if __name__ == "__main__":
    run_websocket_client()
