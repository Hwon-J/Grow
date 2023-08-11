from websocket import create_connection
import json

def run_websocket_client():
    # ws_url = "ws://192.168.100.102:30002"
    ws_url = "ws://192.168.100.37:30002/" 
    # ws_url = "ws://localhost:30002/" 

    ws = create_connection(ws_url)

    # 핸드셰이크 메시지 전송
    handshake_message = json.dumps({"purpose": "handshake" ,"role": "raspi", "serial": "97745"})
    ws.send(handshake_message)

    # 서버로부터의 응답을 기다림
    handshake_response = ws.recv()
    print(f"Handshake completed with response: {handshake_response}")

    try:
        while True:
            user_input = input("Enter a message to send to the server: ")
            message = json.dumps({"purpose": "gpt" ,"role": "raspi",  "content": user_input, "serial": "97745"})
            ws.send(message)
            response = ws.recv()
            print(f"Received response from server: {response}")
    except KeyboardInterrupt:
        print("Exiting client...")
    finally:
        ws.close()


if __name__ == "__main__":
    run_websocket_client()
