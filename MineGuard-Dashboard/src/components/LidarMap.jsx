import React from 'react';
import '../styles/LidarMap.css';

export default function LidarMap({ lidarData }) {
  const isOffline = !lidarData || lidarData.status === 'OFFLINE' || lidarData.status === 'WAITING';

  return (
    <div className="lidar-map-container">
      <div className="lidar-header">
        <h2>3D LiDAR Mapping System</h2>
        <span className={`demo-badge ${isOffline ? 'offline' : ''}`}>
          {isOffline ? 'LIDAR DATA OFFLINE' : lidarData.status}
        </span>
      </div>

      <div className="lidar-main">
        <div className="lidar-display">
          <div className="lidar-offline-panel">
            <div className="scan-indicator">{isOffline ? 'LIDAR DATA OFFLINE' : 'SCANNING...'}</div>
          </div>
        </div>

        <div className="lidar-info">
          <div className="info-section">
            <h3>LiDAR Status</h3>
            <div className="status-items">
              <div className="status-item">
                <span className="label">Status:</span>
                <span className={`value ${String(lidarData?.status || 'OFFLINE').toLowerCase()}`}>
                  {lidarData?.status || 'OFFLINE'}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Point Count:</span>
                <span className="value">{lidarData?.pointCount?.toLocaleString?.() || '0'}</span>
              </div>
              <div className="status-item">
                <span className="label">Scan Quality:</span>
                <span className="value quality-high">{lidarData?.scanQuality || 'N/A'}</span>
              </div>
              <div className="status-item">
                <span className="label">Depth Range:</span>
                <span className="value">{lidarData?.depthRange || '--'}</span>
              </div>
              <div className="status-item">
                <span className="label">Accuracy:</span>
                <span className="value">{lidarData?.detectionAccuracy || '--'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
