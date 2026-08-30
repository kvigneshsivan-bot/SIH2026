import React from 'react';
import './styles/Dashboard.css';

const overviewStats = [
  { label: 'Temperature', value: '28.5', unit: '°C', state: 'normal', icon: '🌡️' },
  { label: 'Humidity', value: '64', unit: '%', state: 'normal', icon: '💧' },
  { label: 'Gas Level', value: '120', unit: 'ppm', state: 'normal', icon: '⚠️' },
  { label: 'Air Quality', value: 'GOOD', state: 'normal', icon: '🌬️' },
  { label: 'Structural Status', value: 'STABLE', state: 'normal', icon: '🛡️' }
];

const alerts = [
  { type: 'danger', text: 'High Gas Concentration Detected', location: 'Zone B - Tunnel 2', time: '04:34 PM' },
  { type: 'warning', text: 'Humidity Above Threshold', location: 'Tunnel C - Zone 1', time: '04:32 PM' },
  { type: 'info', text: 'Rover Reached Checkpoint 4', location: 'Tunnel A', time: '04:30 PM' }
];

const features = [
  'AI-based hazard detection',
  'Survivor detection (thermal + visual)',
  'Real-time gas monitoring',
  'Waterproof IP68 body',
  'Autonomous route planning',
  'Emergency beacon and light system'
];

const components = [
  '360° Pan-Tilt Camera',
  'Thermal Imaging',
  'LIDAR + Gas Sensor',
  'AI Processor',
  'Battery Pack',
  'Motor Drives',
  'Waterproof Body',
  'Communication Stack'
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="real-ops-layout">
        <div className="status-strip row-grid">
          {overviewStats.map((item) => (
            <div key={item.label} className="metric-tile">
              <div className="metric-head">
                <span className="metric-icon">{item.icon}</span>
                <span className="metric-label">{item.label}</span>
              </div>

              <div className="metric-value-wrap">
                <span className="metric-value">{item.value}</span>
                {item.unit && <span className="metric-unit">{item.unit}</span>}
              </div>

              <div className="metric-status">{item.state === 'normal' ? 'NORMAL' : 'ALERT'}</div>
            </div>
          ))}
        </div>

        <div className="hero-grid">
          <section className="panel rover-panel large-panel">
            <div className="panel-topline">
              <h3>MineGuard Rover Field System</h3>
              <span className="badge success">Online</span>
            </div>

            <div className="rover-scene">
              <div className="rover-vehicle" aria-label="MineGuard rover design" />
              <div className="tag tag-a">LiDAR / Laser Scanner</div>
              <div className="tag tag-b">Gas Sensor Array</div>
              <div className="tag tag-c">Thermal Camera</div>
              <div className="tag tag-d">Emergency Beacon</div>
              <div className="tag tag-e">Environmental Sensors</div>
              <div className="tag tag-f">Retractable Claw</div>
            </div>
          </section>

          <aside className="panel hardware-panel">
            <div className="panel-topline">
              <h3>Dimensions</h3>
            </div>

            <div className="dimension-card">
              <div className="side-view vehicle-mini" />
              <div className="dimension-labels">
                <span>52 cm</span>
                <span>110 cm</span>
                <span>70 cm</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mid-grid">
          <section className="panel map-panel">
            <div className="panel-topline">
              <h3>Mine Map & Rover Location</h3>
              <div className="map-tools">
                <button>-</button>
                <span>100%</span>
                <button>+</button>
              </div>
            </div>

            <div className="map-surface">
              <div className="tunnel tunnel-a" />
              <div className="tunnel tunnel-b" />
              <div className="tunnel tunnel-c" />
              <div className="zone checkpoint cp-1" />
              <div className="zone checkpoint cp-2" />
              <div className="zone checkpoint cp-3" />
              <div className="zone safe s-1" />
              <div className="zone safe s-2" />
              <div className="zone hazard h-1" />
              <div className="zone hazard h-2" />
              <div className="zone worker w-1" />
              <div className="rover-point" />
              <div className="base-station" />
            </div>

            <div className="map-footer">
              <span>Rover: 0m, 0m</span>
              <span>Hazards: 0</span>
              <span>Survivors: 0</span>
            </div>
          </section>

          <section className="panel camera-panel">
            <div className="panel-topline">
              <h3>Live Camera Feed</h3>
              <span className="badge danger">Live</span>
            </div>

            <div className="camera-feed">
              <div className="camera-label">Rover Camera</div>
            </div>
          </section>

          <section className="panel detection-panel">
            <div className="panel-topline">
              <h3>Human Detection</h3>
            </div>

            <div className="detection-box">
              <div className="detection-frame" />
            </div>

            <div className="details-block">
              <div className="detail-row">
                <span>Status</span>
                <strong>Person Detected</strong>
              </div>
              <div className="detail-row">
                <span>Location</span>
                <strong>Tunnel B - Zone 2</strong>
              </div>
              <div className="detail-row">
                <span>Confidence</span>
                <strong>94%</strong>
              </div>
            </div>

            <button className="action-button">Possible Trapped Worker</button>
          </section>
        </div>

        <div className="lower-grid">
          <section className="panel alert-panel">
            <div className="panel-topline">
              <h3>Alerts</h3>
              <button className="mini-button">View All</button>
            </div>

            <div className="alert-list">
              {alerts.map((alert) => (
                <div key={alert.text} className={`alert-row ${alert.type}`}>
                  <div className="alert-icon">{alert.type === 'danger' ? '⚠️' : alert.type === 'warning' ? '⚠' : 'ℹ️'}</div>
                  <div className="alert-copy">
                    <strong>{alert.text}</strong>
                    <span>{alert.location}</span>
                  </div>
                  <div className="alert-time">{alert.time}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rover-status-panel">
            <div className="panel-topline">
              <h3>Rover Status</h3>
              <span className="badge success">Online</span>
            </div>

            <div className="rover-illustration">
              <div className="mini-rover" />
            </div>

            <div className="status-grid-two">
              <div><span>Battery</span><strong>78%</strong></div>
              <div><span>Speed</span><strong>0.8 m/s</strong></div>
              <div><span>Location</span><strong>Tunnel B</strong></div>
              <div><span>Distance</span><strong>245.6 m</strong></div>
              <div><span>Connection</span><strong>Stable</strong></div>
              <div><span>Last Update</span><strong>2 sec ago</strong></div>
            </div>
          </section>

          <section className="panel trends-panel">
            <div className="panel-topline">
              <h3>Environment Trends</h3>
              <button className="mini-button">1 Hour</button>
            </div>

            <div className="trend-bars">
              {[42, 58, 61, 64, 70].map((value, index) => (
                <div key={index} className="trend-column">
                  <span className="bar bar-1" style={{ height: `${value}%` }} />
                  <span className="bar bar-2" style={{ height: `${value - 10}%` }} />
                  <span className="bar bar-3" style={{ height: `${value + 8}%` }} />
                  <span className="bar bar-4" style={{ height: `${value / 2}%` }} />
                  <small>04:{String(20 + index * 5).padStart(2, '0')}</small>
                </div>
              ))}
            </div>

            <div className="legend-row">
              <span><i className="legend temp" />Temperature</span>
              <span><i className="legend hum" />Humidity</span>
              <span><i className="legend gas" />Gas</span>
              <span><i className="legend air" />Air</span>
            </div>
          </section>
        </div>

        <div className="bottom-section">
          <div className="bottom-card">
            <h4>Body Layers & Materials</h4>
            <ul>
              <li>Outer coating with anti-corrosion finish</li>
              <li>Aluminum + steel alloy frame</li>
              <li>Sealed electronics and waterproof joints</li>
              <li>Shock-resistant composite shell</li>
            </ul>
          </div>

          <div className="bottom-card">
            <h4>Component Layout</h4>
            <ul>
              {components.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="bottom-card">
            <h4>Key Features</h4>
            <ul>
              {features.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
