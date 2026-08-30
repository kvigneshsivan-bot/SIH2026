import React from 'react';
import { Target, Thermometer, Eye, Mic } from 'lucide-react';
import '../styles/SurvivorDetection.css';

export default function SurvivorDetection({ aiData }) {
  const confidencePercent = (aiData.detectionConfidence * 100).toFixed(0);

  return (
    <div className="survivor-detection-container">
      <div className="detection-header">
        <h2>AI Human / Survivor Detection System</h2>
        <span className="demo-badge">DEMO / SIMULATED DATA</span>
      </div>

      <div className="detection-main">
        <div className="detection-status">
          {aiData.survivorDetected ? (
            <div className="detected">
              <div className="pulse-indicator"></div>
              <h3>🟢 SURVIVOR DETECTED</h3>
            </div>
          ) : (
            <div className="not-detected">
              <h3>⭕ No Survivor Detected</h3>
            </div>
          )}
        </div>

        <div className="confidence-section">
          <h3>Detection Confidence</h3>
          <div className="confidence-bar-container">
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
            <span className="confidence-value">{confidencePercent}%</span>
          </div>
        </div>

        <div className="detection-details">
          <div className="detail-item">
            <span className="detail-label">Detected Location:</span>
            <span className="detail-value">{aiData.detectedLocation}</span>
          </div>

          <div className="detection-methods">
            <h3>Detection Methods</h3>
            <div className="methods-grid">
              <div className={`method-card ${aiData.thermalDetectionStatus === 'CONFIRMED' ? 'confirmed' : 'standby'}`}>
                <Thermometer size={24} />
                <span className="method-name">Thermal Detection</span>
                <span className="method-status">{aiData.thermalDetectionStatus}</span>
              </div>

              <div className={`method-card ${aiData.visualDetectionStatus === 'CONFIRMED' ? 'confirmed' : 'standby'}`}>
                <Eye size={24} />
                <span className="method-name">Visual Detection</span>
                <span className="method-status">{aiData.visualDetectionStatus}</span>
              </div>

              <div className={`method-card ${aiData.audioDetectionStatus === 'DETECTED' ? 'confirmed' : 'standby'}`}>
                <Mic size={24} />
                <span className="method-name">Audio Detection</span>
                <span className="method-status">{aiData.audioDetectionStatus}</span>
              </div>
            </div>
          </div>

          <div className="detection-info">
            <div className="info-item">
              <span className="label">Last Detection:</span>
              <span className="value">{aiData.lastDetectionTime}</span>
            </div>
            <div className="info-item">
              <span className="label">Model Version:</span>
              <span className="value">MineGuard AI v2.1</span>
            </div>
            <div className="info-item">
              <span className="label">Processing Time:</span>
              <span className="value">~350ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detection-actions">
        <button className="action-btn primary">Initiate Rescue</button>
        <button className="action-btn secondary">Alert Control Room</button>
        <button className="action-btn secondary">Start Recording</button>
      </div>

      <div className="detection-disclaimer">
        <strong>⚠️ Disclaimer:</strong> This is a simulated AI detection system for demonstration purposes. 
        When real AI models and hardware are integrated, actual human detection capabilities will be available.
      </div>
    </div>
  );
}
