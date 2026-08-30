import React, { useState } from 'react';
import { Video, Maximize2 } from 'lucide-react';
import '../styles/CameraFeed.css';

export default function CameraFeed({ cameras, onCameraChange }) {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);

  const handleCameraChange = (camera) => {
    setSelectedCamera(camera);
    onCameraChange(camera);
  };

  return (
    <div className="camera-feed-container">
      <div className="camera-header">
        <h2>Live Camera Monitoring</h2>
        <span className="camera-status">🔴 DEMO / SIMULATED CAMERA FEED</span>
      </div>

      <div className="camera-main">
        <div className="camera-viewport">
          <div className="camera-feed-display">
            <div className="camera-overlay">
              <div className="camera-info">
                <span className="camera-name">{selectedCamera.name}</span>
                <span className={`camera-status-indicator ${selectedCamera.status.toLowerCase()}`}>
                  {selectedCamera.status}
                </span>
              </div>

              {selectedCamera.active ? (
                <div className="feed-placeholder">
                  <Video size={64} />
                  <p>Live Simulated Feed</p>
                  <div className="scan-line"></div>
                </div>
              ) : (
                <div className="feed-placeholder inactive">
                  <Video size={64} />
                  <p>Camera Standby</p>
                </div>
              )}

              <div className="camera-controls-overlay">
                <div className="pan-tilt-controls">
                  <button className="control-btn" title="Pan Up">▲</button>
                  <div className="control-row">
                    <button className="control-btn" title="Pan Left">◀</button>
                    <button className="control-btn center" title="Center">●</button>
                    <button className="control-btn" title="Pan Right">▶</button>
                  </div>
                  <button className="control-btn" title="Pan Down">▼</button>
                </div>

                <div className="camera-zoom">
                  <button className="zoom-btn">+</button>
                  <span className="zoom-level">1x</span>
                  <button className="zoom-btn">−</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="camera-controls">
          <div className="camera-selector">
            <h3>Camera Selection</h3>
            <div className="camera-buttons">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  className={`camera-btn ${selectedCamera.id === camera.id ? 'active' : ''}`}
                  onClick={() => handleCameraChange(camera)}
                >
                  <Video size={18} />
                  <span>{camera.name}</span>
                  <span className={`status-dot ${camera.status.toLowerCase()}`}></span>
                </button>
              ))}
            </div>
          </div>

          <div className="recording-info">
            <div className="recording-item">
              <span className="label">Recording:</span>
              <span className="value">ON</span>
            </div>
            <div className="recording-item">
              <span className="label">Bitrate:</span>
              <span className="value">2.5 Mbps</span>
            </div>
            <div className="recording-item">
              <span className="label">Resolution:</span>
              <span className="value">1080p</span>
            </div>
            <div className="recording-item">
              <span className="label">FPS:</span>
              <span className="value">30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="camera-notes">
        <strong>⚠️ Note:</strong> This is a simulated camera feed for demonstration purposes. 
        When actual hardware is connected, real-time camera streams will be displayed here.
      </div>
    </div>
  );
}
