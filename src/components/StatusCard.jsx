import React from 'react';
import '../styles/StatusCard.css';

export default function StatusCard({ title, value, unit, status, icon, details }) {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SAFE':
      case 'GOOD':
      case 'OPERATIONAL':
      case 'CONNECTED':
      case 'STRONG':
        return 'status-safe';
      case 'WARNING':
      case 'FAIR':
      case 'MONITORING':
        return 'status-warning';
      case 'CRITICAL':
      case 'POOR':
      case 'DISCONNECTED':
        return 'status-critical';
      default:
        return 'status-neutral';
    }
  };

  return (
    <div className={`status-card ${getStatusColor(status)}`}>
      <div className="card-header">
        <div className="card-title-section">
          {icon && <span className="card-icon">{icon}</span>}
          <h3 className="card-title">{title}</h3>
        </div>
        <span className={`status-badge ${getStatusColor(status)}`}>{status}</span>
      </div>

      <div className="card-body">
        <div className="card-value">
          <span className="value">{value}</span>
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>

      {details && (
        <div className="card-details">
          {details.map((detail, index) => (
            <div key={index} className="detail-row">
              <span className="detail-label">{detail.label}:</span>
              <span className="detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
