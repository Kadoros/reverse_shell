import React from 'react';

const VideoStream: React.FC = () => {
  return (
    <div>
      <h1>Real-Time Video Stream</h1>
      <img
        src="http://127.0.0.1:5000/video_feed" // Change the URL if your Flask server is hosted elsewhere
        alt="Video Stream"
      />
    </div>
  );
};

export default VideoStream;
