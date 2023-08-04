from websocket import create_connection
import json

def run_websocket_client():
    ws_url = "ws://i9c103.p.ssafy.io:30002/"
    ws = create_connection(ws_url)

    # 핸드셰이크 메시지 전송
    handshake_message = json.dumps({"role": "handshake", "serial": "qwer"})
    ws.send(handshake_message)

    # 서버로부터의 응답을 기다림
    handshake_response = ws.recv()
    print(f"Handshake completed with response: {handshake_response}")

    try:
        while True:
            user_input = input("Enter a message to send to the server: ")
            message = json.dumps({"role": "gpt", "message": user_input, "serial": "qwer"}) 
            ws.send(message)
            response = ws.recv()
            print(f"Received response from server: {response}")
    except KeyboardInterrupt:
        print("Exiting client...")
    finally:
        ws.close()


if __name__ == "__main__":
    run_websocket_client()
