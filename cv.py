import cv2
import numpy as np
from flask import Flask, Response
import pyautogui
import time
app = Flask(__name__)

def generate_frames():
     while True:
        # 화면 캡처
        screen = pyautogui.screenshot()
        frame = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)
        
        # JPEG 인코딩
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # 프레임 속도 제한 (예: 초당 10 프레임)
        time.sleep(0.1)

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
