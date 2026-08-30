import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import '../styles/RoverControls.css';

export default function RoverControls({ onEmergencyStop, emergencyStop }) {
  const [speed, setSpeed] = useState(50);
  const [panAngle, setPanAngle] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(0);

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  const handlePan = (direction) => {
    if (direction === 'left') setPanAngle(Math.max(-180, panAngle - 10));
    if (direction === 'right') setPanAngle(Math.min(180, panAngle + 10));
  };

  const handleTilt = (direction) => {
    if (direction === 'up') setTiltAngle(Math.min(90, tiltAngle + 10));
    if (direction === 'down') setTiltAngle(Math.max(-90, tiltAngle - 10));
  };

  return (
    <div className="rover-controls-container">
      <div className="controls-header">
        <h2>Rover Control Panel</h2>
        <span className="demo-badge">DEMO CONTROLS</span>
      </div>

      <div className="controls-layout">
        <div className="movement-controls">
          <h3>Movement Controls (TELEOPERATED MODE)</h3>
          
          <div className="directional-pad">
            <button className="d-btn forward" title="Move Forward" disabled={emergencyStop}>
              <ChevronUp size={32} />
            </button>
            <div className="d-row">
              <button className="d-btn left" title="Turn Left" disabled={emergencyStop}>
                <ChevronLeft size={32} />
              </button>
              <button className="d-btn center" title="Stop" disabled={emergencyStop}>
                <Square size={24} />
              </button>
              <button className="d-btn right" title="Turn Right" disabled={emergencyStop}>
                <ChevronRight size={32} />
              </button>
            </div>
            <button className="d-btn backward" title="Move Backward" disabled={emergencyStop}>
              <ChevronDown size={32} />
            </button>
          </div>

          <div className="speed-control">
            <label>Speed Control</label>
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={handleSpeedChange}
              disabled={emergencyStop}
              className="speed-slider"
            />
            <div className="speed-display">
              <span className="speed-value">{speed}%</span>
            </div>
          </div>
        </div>

        <div className="camera-controls">
          <h3>Camera Pan/Tilt Controls</h3>
          
          <div className="pan-tilt-pad">
            <button 
              className="pt-btn up" 
              title="Tilt Up"
              onClick={() => handleTilt('up')}
              disabled={emergencyStop}
            >
              <ChevronUp size={28} />
            </button>
            <div className="pt-row">
              <button 
                className="pt-btn left" 
                title="Pan Left"
                onClick={() => handlePan('left')}
                disabled={emergencyStop}
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                className="pt-btn center" 
                title="Reset Pan/Tilt"
                onClick={() => { setPanAngle(0); setTiltAngle(0); }}
                disabled={emergencyStop}
              >
                ◯
              </button>
              <button 
                className="pt-btn right" 
                title="Pan Right"
                onClick={() => handlePan('right')}
                disabled={emergencyStop}
              >
                <ChevronRight size={28} />
              </button>
            </div>
            <button 
              className="pt-btn down" 
              title="Tilt Down"
              onClick={() => handleTilt('down')}
              disabled={emergencyStop}
            >
              <ChevronDown size={28} />
            </button>
          </div>

          <div className="pan-tilt-display">
            <div className="pt-value">
              <span className="label">Pan:</span>
              <span className="value">{panAngle}°</span>
            </div>
            <div className="pt-value">
              <span className="label">Tilt:</span>
              <span className="value">{tiltAngle}°</span>
            </div>
          </div>
        </div>

        <div className="special-controls">
          <h3>Special Controls</h3>
          
          <div className="special-buttons">
            <button className="special-btn" disabled={emergencyStop}>
              🎯 Auto-Navigate
            </button>
            <button className="special-btn" disabled={emergencyStop}>
              📍 Return to Base
            </button>
            <button className="special-btn" disabled={emergencyStop}>
              🔦 Lights ON
            </button>
            <button className="special-btn" disabled={emergencyStop}>
              📹 Record Video
            </button>
          </div>

          <div className="mode-selector">
            <label>Navigation Mode</label>
            <select disabled={emergencyStop}>
              <option>TELEOPERATED</option>
              <option>SEMI-AUTONOMOUS</option>
              <option>AUTONOMOUS (Limited)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="emergency-section">
        <button 
          className={`emergency-btn ${emergencyStop ? 'active' : ''}`}
          onClick={onEmergencyStop}
        >
          <span className="emergency-icon">🛑</span>
          EMERGENCY STOP
        </button>
        {emergencyStop && (
          <div className="emergency-message">
            ⚠️ ROVER STOPPED - All movement controls disabled
          </div>
        )}
      </div>

      <div className="controls-disclaimer">
        <strong>⚠️ Demo Controls:</strong> These controls are simulated for demonstration purposes. 
        When actual hardware is connected, real rover movement will be controlled by these buttons.
      </div>
    </div>
  );
}
