import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import '../styles/HazardAlerts.css';

export default function HazardAlerts({ hazards }) {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '🔴';
      case 'HIGH':
        return '🟠';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const criticalCount = hazards.filter(h => h.severity === 'CRITICAL').length;
  const highCount = hazards.filter(h => h.severity === 'HIGH').length;
  const mediumCount = hazards.filter(h => h.severity === 'MEDIUM').length;

  return (
    <div className="hazard-alerts-container">
      <div className="hazards-header">
        <h2>Hazard Detection System</h2>
        <span className="demo-badge">DEMO / SIMULATED DATA</span>
      </div>

      <div className="hazard-summary">
        <div className={`summary-card critical`}>
          <span className="count">{criticalCount}</span>
          <span className="label">CRITICAL</span>
        </div>
        <div className={`summary-card high`}>
          <span className="count">{highCount}</span>
          <span className="label">HIGH</span>
        </div>
        <div className={`summary-card medium`}>
          <span className="count">{mediumCount}</span>
          <span className="label">MEDIUM</span>
        </div>
        <div className={`summary-card total`}>
          <span className="count">{hazards.length}</span>
          <span className="label">TOTAL</span>
        </div>
      </div>

      <div className="hazards-list">
        {hazards.map((hazard) => (
          <div 
            key={hazard.id} 
            className={`hazard-item severity-${hazard.severity.toLowerCase()}`}
          >
            <div className="hazard-icon">
              {hazard.severity === 'CRITICAL' && <AlertTriangle size={24} />}
              {hazard.severity !== 'CRITICAL' && <AlertCircle size={24} />}
            </div>

            <div className="hazard-content">
              <div className="hazard-type">
                {getSeverityIcon(hazard.severity)} {hazard.type}
              </div>
              <div className="hazard-location">📍 {hazard.location}</div>
              <div className="hazard-time">🕐 {hazard.timestamp}</div>
            </div>

            <div className="hazard-status">
              <span className={`status-badge status-${hazard.status.toLowerCase()}`}>
                {hazard.status}
              </span>
            </div>

            <div className="hazard-actions">
              <button className="action-btn">View</button>
              <button className="action-btn">Resolve</button>
            </div>
          </div>
        ))}
      </div>

      {hazards.length === 0 && (
        <div className="no-hazards">
          <AlertCircle size={48} />
          <p>No active hazards detected</p>
        </div>
      )}

      <div className="hazard-legend">
        <h3>Hazard Types & Thresholds</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="hazard-type-label">Gas Leak</span>
            <span className="threshold">Immediate Action</span>
          </div>
          <div className="legend-item">
            <span className="hazard-type-label">High Temperature</span>
            <span className="threshold">&gt; 45°C</span>
          </div>
          <div className="legend-item">
            <span className="hazard-type-label">Flood Detection</span>
            <span className="threshold">&gt; 3.0m</span>
          </div>
          <div className="legend-item">
            <span className="hazard-type-label">Methane Alert</span>
            <span className="threshold">&gt; 1.25%</span>
          </div>
          <div className="legend-item">
            <span className="hazard-type-label">Structural Weakness</span>
            <span className="threshold">Vibration &gt; 2.5Hz</span>
          </div>
          <div className="legend-item">
            <span className="hazard-type-label">Low Oxygen</span>
            <span className="threshold">&lt; 18%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
