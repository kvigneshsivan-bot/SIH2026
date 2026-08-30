import React from 'react';
import { ShieldCheck, AlertTriangle, Wifi, BatteryCharging, Clock3 } from 'lucide-react';
import '../styles/Header.css';

const safeValue = (value, fallback = '--') => (value == null || value === '' ? fallback : value);

export default function Header({ systemStatus, roverStatus, emergencyStop, onEmergencyStop }) {
  const mineStatus = safeValue(systemStatus?.mineStatus, 'SAFE');
  const connectionStatus = safeValue(systemStatus?.connectionStatus, 'CONNECTED');
  const roverState = safeValue(systemStatus?.roverStatus, 'ONLINE');
  const alertCount = safeValue(systemStatus?.activeAlerts ?? 0, 0);
  const batteryLevel = systemStatus?.batteryLevel == null ? '78%' : `${Math.round(systemStatus.batteryLevel)}%`;

  return (
    <header className="header">
      <div className="header-title-wrap">
        <div className="logo-mark">⛏️</div>
        <div className="header-title-text">
          AI-POWERED UNDERGROUND MINE SAFETY, MONITORING &amp; RESCUE SYSTEM
        </div>
      </div>

      <div className="header-status-block">
        <div className="system-status-pill safe">
          <ShieldCheck size={14} />
          <span>SYSTEM STATUS</span>
          <strong>SAFE</strong>
        </div>

        <div className="status-badge-inline">
          <Wifi size={14} />
          <span>{connectionStatus}</span>
        </div>

        <div className="status-badge-inline">
          <BatteryCharging size={14} />
          <span>{batteryLevel}</span>
        </div>

        <div className="status-badge-inline alert-inline">
          <AlertTriangle size={14} />
          <span>{alertCount}</span>
        </div>

        <div className="header-clock">
          <Clock3 size={14} />
          <span>04:35:22 PM</span>
        </div>

        <div className="header-date">24 May 2025</div>
      </div>
    </header>
  );
}
