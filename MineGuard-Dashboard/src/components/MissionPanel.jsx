import React from 'react';
import { Target, Compass, Clock, Gauge } from 'lucide-react';
import '../styles/MissionPanel.css';

export default function MissionPanel({ mission }) {
  const currentMission = mission || {};
  const missionId = currentMission.missionId || 'N/A';
  const objective = currentMission.missionObjective || 'Awaiting mission configuration from backend.';
  const roverLocation = currentMission.roverLocation || 'WAITING FOR LOCATION';
  const duration = currentMission.missionDuration || '--';
  const distance = currentMission.distanceTravelled ?? '--';
  const rescueStatus = String(currentMission.rescueStatus || 'STANDBY');
  const currentTask = currentMission.currentTask || 'Waiting for task assignment';

  return (
    <div className="mission-panel-container">
      <div className="panel-header">
        <h2>Current Mission</h2>
        <span className="demo-badge">BACKEND STATUS</span>
      </div>

      <div className="mission-card">
        <div className="mission-title-section">
          <h3>{missionId}</h3>
          <span className="mission-status status-neutral">{rescueStatus}</span>
        </div>

        <div className="mission-details-grid">
          <div className="detail-box">
            <div className="detail-icon"><Compass size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Current Location</span>
              <span className="detail-value">{roverLocation}</span>
            </div>
          </div>

          <div className="detail-box">
            <div className="detail-icon"><Clock size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Mission Duration</span>
              <span className="detail-value">{duration}</span>
            </div>
          </div>

          <div className="detail-box">
            <div className="detail-icon"><Gauge size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Distance Travelled</span>
              <span className="detail-value">{distance === '--' ? '--' : `${distance} km`}</span>
            </div>
          </div>

          <div className="detail-box">
            <div className="detail-icon"><Target size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Rescue Status</span>
              <span className="rescue-status rescue-neutral">{rescueStatus}</span>
            </div>
          </div>
        </div>

        <div className="mission-objective">
          <h3>Mission Objective</h3>
          <div className="objective-box">
            <p>{objective}</p>
          </div>
        </div>

        <div className="mission-objective">
          <h3>Current Task</h3>
          <div className="objective-box">
            <p>{currentTask}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
