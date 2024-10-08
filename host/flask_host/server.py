from flask import Flask, request, jsonify
import socket
import threading
import cv2
from vidstream import StreamingServer
from flask_cors import CORS
import pickle
import struct

app = Flask(__name__)
CORS(app)

# Global variable to keep track of the active connection and the streaming server
active_connection = None
video_server = None

# Initialize the streaming server class to forward video
class ForwardingStreamingServer(StreamingServer):
    def __init__(self, host, port, forward_host, forward_port, slots=8, quit_key='q'):
        super().__init__(host, port, slots, quit_key)
        self.forward_host = forward_host
        self.forward_port = forward_port
        self.forward_socket = None
        self.forward_thread = None

    def start_forwarding(self):
        """Starts a new thread to forward the stream to another server."""
        self.forward_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.forward_socket.connect((self.forward_host, self.forward_port))
        self.forward_thread = threading.Thread(target=self.forward_stream)
        self.forward_thread.start()

    def forward_stream(self):
        """Forwards the incoming stream to the secondary server."""
        while self.__running:
            if self.__used_slots > 0:  # Only forward if there are active clients
                pass  # Implement frame forwarding logic here if needed

    def __client_connection(self, connection, address):
        """Handles the individual client connections and processes their stream data."""
        payload_size = struct.calcsize('>L')
        data = b""

        while self.__running:
            break_loop = False

            while len(data) < payload_size:
                received = connection.recv(4096)
                if received == b'':
                    connection.close()
                    self.__used_slots -= 1
                    break_loop = True
                    break
                data += received

            if break_loop:
                break

            packed_msg_size = data[:payload_size]
            data = data[payload_size:]

            msg_size = struct.unpack(">L", packed_msg_size)[0]

            while len(data) < msg_size:
                data += connection.recv(4096)

            frame_data = data[:msg_size]
            data = data[msg_size:]

            if self.forward_socket:
                try:
                    self.forward_socket.sendall(packed_msg_size + frame_data)
                except Exception as e:
                    print(f"Failed to send frame to forward server: {e}")

            frame = pickle.loads(frame_data, fix_imports=True, encoding="bytes")
            frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)
            cv2.imshow(str(address), frame)
            if cv2.waitKey(1) == ord(self.__quit_key):
                connection.close()
                self.__used_slots -= 1
                break

def handle_client(conn, input_value, event, output_container):
    """Handle communication with the client."""
    print(f"Sending input_value to client: {input_value}")
    conn.sendall(input_value.encode())

    # Optionally, receive a response from the client
    output = conn.recv(4096).decode()
    print(f"Received from client: {output}")

    # Store the output in the container
    output_container[0] = output

    # Signal that the thread has finished
    event.set()

@app.route('/input', methods=['POST'])
def handle_input():
    """Handle input from the client."""
    data = request.get_json()
    input_value = data.get('input', '')
    print(input_value)

    global active_connection

    if active_connection is not None:
        # Create a list to capture the output from the thread
        output_container = [None]

        # Create an event to signal when the thread has completed
        event = threading.Event()

        # Start a thread to handle the client connection
        thread = threading.Thread(target=handle_client, args=(active_connection, input_value, event, output_container))
        thread.start()

        # Wait for the event to be set (thread completion)
        event.wait()

        response_message = output_container[0]
    else:
        response_message = "No active connection to send the input_value."

    print(f"Processed input and sent to client: {input_value}. Response: {response_message}")
    return jsonify(message=response_message)

def get_host_ip():
    """Get the local IP address."""
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return local_ip

def start_host(host, port):
    """Start a socket server to handle client connections."""
    global active_connection
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"[+] Listening on {host}:{port}")

    while True:
        conn, addr = server_socket.accept()
        print(f"[+] Connection from {addr}")
        active_connection = conn  # Store the connection to use in the input route

if __name__ == '__main__':
    host_ip = "127.0.0.1"
    port = 12345
    forward_host = "destination_server_ip"  # Replace with the actual IP of the destination server
    forward_port = 6000  # Replace with the actual port of the destination server

    # Start the streaming server
    video_server = ForwardingStreamingServer(host_ip, 5001, forward_host, forward_port)
    video_server.start_server()
    video_server.start_forwarding()  # Start forwarding to another server

    # Start the socket server in a separate thread
    threading.Thread(target=start_host, args=(host_ip, port), daemon=True).start()

    # Start the Flask application
    app.run(host='0.0.0.0', port=5000)  # Listen on all interfaces
    print(f"Server IP: {host_ip}")
