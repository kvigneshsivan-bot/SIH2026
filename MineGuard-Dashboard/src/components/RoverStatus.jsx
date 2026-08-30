import React from 'react';
import { Radio, Zap, Gauge, MapPin, Wifi, Clock } from 'lucide-react';
import '../styles/RoverStatus.css';

export default function RoverStatus({ status }) {
  const batteryLevel = Number(status?.batteryLevel ?? 0);
  const signal = String(status?.communicationSignal || 'OFFLINE');

  const getBatteryColor = (level) => {
    if (level == null || Number.isNaN(level)) return 'battery-low';
    if (level > 60) return 'battery-high';
    if (level > 30) return 'battery-medium';
    return 'battery-low';
  };

  const getSignalBars = (signalValue) => {
    switch (signalValue) {
      case 'STRONG':
        return 4;
      case 'GOOD':
        return 3;
      case 'FAIR':
        return 2;
      case 'WEAK':
        return 1;
      default:
        return 0;
    }
  };

  const signalBars = getSignalBars(signal);

  return (
    <div className="rover-status-container">
      <div className="status-header">
        <h2>Rover Status & Telemetry</h2>
      </div>

      <div className="status-grid">
        <div className={`status-panel ${getBatteryColor(batteryLevel)}`}>
          <div className="panel-icon">
            <Zap size={32} />
          </div>
          <div className="panel-content">
            <h3>Battery Level</h3>
            <div className="battery-display">
              <span className="battery-value">{batteryLevel ? `${batteryLevel.toFixed(1)}%` : '--'}</span>
              <div className="battery-bar">
                <div
                  className="battery-fill"
                  style={{ width: `${batteryLevel || 0}%` }}
                ></div>
              </div>
            </div>
            <p className="panel-note">Estimated Runtime: {batteryLevel ? `${Math.max(0, Math.round(batteryLevel / 10))} hours` : '--'}</p>
          </div>
        </div>

        <div className="status-panel">
          <div className="panel-icon">
            <Radio size={32} />
          </div>
          <div className="panel-content">
            <h3>Motor Status</h3>
            <div className="motor-status">
              <span className="status-value operational">{status?.motorStatus || 'STANDBY'}</span>
            </div>
          </div>
        </div>

        <div className="status-panel">
          <div className="panel-icon">
            <Gauge size={32} />
          </div>
          <div className="panel-content">
            <h3>Rover Speed</h3>
            <div className="speed-display">
              <span className="speed-value">{status?.speed != null ? Number(status.speed).toFixed(1) : '--'}</span>
              <span className="speed-unit">m/s</span>
            </div>
            <p className="panel-note">Navigation: {status?.navigationMode || 'STANDBY'}</p>
          </div>
        </div>

        <div className="status-panel">
          <div className="panel-icon">
            <MapPin size={32} />
          </div>
          <div className="panel-content">
            <h3>Current Location</h3>
            <div className="location-value">{status?.currentLocation || 'WAITING FOR LOCATION'}</div>
            <p className="panel-note">Live updates when backend is connected</p>
          </div>
        </div>

        <div className={`status-panel signal-${signal.toLowerCase()}`}>
          <div className="panel-icon">
            <Wifi size={32} />
          </div>
          <div className="panel-content">
            <h3>Communication Signal</h3>
            <div className="signal-bars">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`bar ${bar <= signalBars ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <p className="panel-note">{signal}</p>
          </div>
        </div>

        <div className="status-panel">
          <div className="panel-icon">
            <Clock size={32} />
          </div>
          <div className="panel-content">
            <h3>Mission Info</h3>
            <div className="mission-times">
              <div className="time-item">
                <span className="label">Mission Time:</span>
                <span className="value">{status?.missionTime || '--'}</span>
              </div>
              <div className="time-item">
                <span className="label">Last Update:</span>
                <span className="value">{status?.lastDataUpdate || '--'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
