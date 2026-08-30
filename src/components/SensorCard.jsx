import React, { useEffect, useState } from 'react';
import '../styles/SensorCard.css';

export default function SensorCard({
  label,
  value,
  unit,
  min = 0,
  max = 100,
  icon,
  warningThreshold,
  criticalThreshold,
  timestamp,
  status: externalStatus
}) {
  const [percentage, setPercentage] = useState(0);
  const numericValue = value === null || value === undefined || value === '' ? null : Number(value);

  useEffect(() => {
    if (numericValue == null) {
      setPercentage(0);
      return;
    }

    const range = max - min || 1;
    const position = numericValue - min;
    const percent = Math.min(100, Math.max(0, (position / range) * 100));
    setPercentage(percent);
  }, [numericValue, min, max]);

  const getStatus = () => {
    if (numericValue == null) return 'offline';
    if (criticalThreshold != null && numericValue >= criticalThreshold) return 'critical';
    if (warningThreshold != null && numericValue >= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = externalStatus || getStatus();

  return (
    <div className={`sensor-card sensor-${status}`}>
      <div className="sensor-header">
        {icon && <span className="sensor-icon">{icon}</span>}
        <div className="sensor-info">
          <h4 className="sensor-label">{label}</h4>
          <span className="sensor-unit">{unit}</span>
        </div>
      </div>

      <div className="sensor-value">
        <span className="value-number">{numericValue == null ? '--' : Number(numericValue).toFixed(1)}</span>
      </div>

      <div className="sensor-bar-container">
        <div className="sensor-bar-background">
          <div
            className="sensor-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="sensor-scale">
          <span className="scale-min">{min}</span>
          <span className="scale-max">{max}</span>
        </div>
      </div>

      <div className="sensor-thresholds">
        {warningThreshold != null && (
          <div className="threshold warning-threshold">
            ⚠️ Warning: {warningThreshold}
          </div>
        )}
        {criticalThreshold != null && (
          <div className="threshold critical-threshold">
            🔴 Critical: {criticalThreshold}
          </div>
        )}
      </div>

      <div className="sensor-meta">
        <span>{timestamp || 'WAITING FOR SENSOR DATA'}</span>
      </div>

      <div className={`sensor-status ${status}`}>
        {status === 'critical' && '🔴 CRITICAL'}
        {status === 'warning' && '🟡 WARNING'}
        {status === 'normal' && '🟢 NORMAL'}
        {status === 'offline' && '⚫ OFFLINE'}
      </div>
    </div>
  );
}
