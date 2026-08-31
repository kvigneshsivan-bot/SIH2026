import React from 'react';
import { MapPin, Users, Siren } from 'lucide-react';
import '../styles/MineMap.css';

function DashboardPersonMap({ dashboardPeople, onPersonSos }) {
  const [selectedPersonId, setSelectedPersonId] = React.useState(null);
  const sosCount = dashboardPeople.filter((person) => person.status === 'sos').length;

  return (
    <div className="dashboard-person-map" aria-label="Personnel locations and SOS status">
      <div className="dashboard-map-layer">
        <div className="dashboard-map-grid" />
        <div className="dashboard-tunnel-label">UNDERGROUND WORK AREA / TUNNEL NETWORK</div>
        <div className="mine-level level-one"><span>LEVEL 01 / MAIN DRIFT</span></div>
        <div className="mine-level level-two"><span>LEVEL 02 / WORKING SEAM</span></div>
        <div className="mine-level level-three"><span>LEVEL 03 / LOWER DRIFT</span></div>
        <div className="mine-shaft"><span>ACCESS SHAFT</span></div>
        <div className="mine-shaft-lift" />
        <div className="tunnel-line tunnel-main" />
        <div className="tunnel-line tunnel-branch tunnel-branch-one" />
        <div className="tunnel-line tunnel-branch tunnel-branch-two" />
        <div className="tunnel-line tunnel-branch tunnel-branch-three" />
        <div className="tunnel-line tunnel-branch tunnel-branch-four" />
        <div className="tunnel-junction junction-one" />
        <div className="tunnel-junction junction-two" />
        <div className="tunnel-junction junction-three" />
        <div className="map-zone-card zone-north">NORTH GALLERY</div>
        <div className="map-zone-card zone-east">EAST CONVEYOR DRIFT</div>
        <div className="map-zone-card zone-longwall">LONGWALL FACE A</div>
        <div className="map-zone-card zone-sump">SUMP &amp; PUMP HOUSE</div>
        <div className="map-zone-card zone-deep">DEEP DEVELOPMENT HEADING</div>
        {dashboardPeople.map((person) => (
          <div
            key={person.id}
            className={`dashboard-person-marker ${person.status === 'sos' || selectedPersonId === person.id ? 'is-sos' : ''}`}
            style={{ left: person.position.left, top: person.position.top }}
          >
            <span className="person-pulse" />
            <button
              type="button"
              className="person-dot"
              aria-label={`Show ${person.name} on map`}
              onClick={() => setSelectedPersonId(person.id)}
            >{person.id.slice(-2)}</button>
          </div>
        ))}
        <div className="dashboard-map-summary">
          <span><Users size={13} /> {dashboardPeople.length} PEOPLE TRACKED</span>
          <span className={sosCount ? 'summary-sos' : ''}><Siren size={13} /> {sosCount} SOS ACTIVE</span>
        </div>
      </div>
      <div className="dashboard-person-details">
        <div className="dashboard-map-legend">
          <span><i className="legend-dot legend-worker" /> GREEN DOT = WORKER SAFE</span>
          <span><i className="legend-dot legend-sos" /> RED DOT = SELECTED / SOS</span>
          <span><i className="legend-line" /> CYAN LINE = TUNNEL</span>
        </div>
        <div className="dashboard-details-heading"><Users size={13} /> PERSONNEL DETAILS ({dashboardPeople.length})</div>
        <div className="dashboard-person-grid">
          {dashboardPeople.map((person) => (
            <button
              key={person.id}
              type="button"
              className={`dashboard-person-card ${selectedPersonId === person.id ? 'is-selected' : ''} ${person.status === 'sos' ? 'is-sos' : ''}`}
              onClick={() => setSelectedPersonId(person.id)}
            >
              <span><strong>ID: {person.id}</strong><em>{person.status === 'sos' ? 'SOS ACTIVE' : 'SAFE'}</em></span>
              <b>{person.name}</b>
              <small><MapPin size={10} /> {person.location}</small>
              <span
                className="person-sos-action"
                role="button"
                tabIndex={0}
                onClick={(event) => { event.stopPropagation(); onPersonSos?.(person.id); }}
                onKeyDown={(event) => { if (event.key === 'Enter') { event.stopPropagation(); onPersonSos?.(person.id); } }}
              ><Siren size={10} /> {person.status === 'sos' ? 'SOS ACTIVE' : 'ACTIVATE SOS'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MineMapCanvas({ mapData, personnelData = [] }) {
  const [zoom, setZoom] = React.useState(1);

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 3) setZoom(zoom + 0.5);
    if (direction === 'out' && zoom > 1) setZoom(zoom - 0.5);
  };

  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom transform
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const levelHeight = 100;
    const startY = 50;
    const shaftX = 80;
    const levelWidth = 500;

    // Draw shaft (vertical)
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(shaftX, startY);
    ctx.lineTo(shaftX, startY + levelHeight * 4);
    ctx.stroke();

    // Draw 4 mining levels
    for (let i = 0; i < 4; i++) {
      const y = startY + i * levelHeight;

      // Level background
      ctx.fillStyle = i % 2 === 0 ? '#d4a574' : '#c49060';
      ctx.fillRect(shaftX, y, levelWidth, levelHeight);

      // Level border
      ctx.strokeStyle = '#8b6f47';
      ctx.lineWidth = 2;
      ctx.strokeRect(shaftX, y, levelWidth, levelHeight);

      // Level label
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${12}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(`Level ${i + 1}`, shaftX + 10, y + 20);

      // Draw tunnel sections in each level
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(shaftX + 80, y + levelHeight / 2);
      ctx.lineTo(shaftX + levelWidth - 20, y + levelHeight / 2);
      ctx.stroke();

      // Draw people on this level
      const peopleOnLevel = Array.isArray(personnelData)
        ? personnelData.filter(
            p => p?.position && Array.isArray(p.position) && p.position[1] > y && p.position[1] < y + levelHeight
          )
        : [];

      peopleOnLevel.forEach((person, idx) => {
        const personX = shaftX + 120 + idx * 40;
        const personY = y + levelHeight / 2;

        // Draw SOS alert if triggered
        if (person.sosTrigger) {
          ctx.fillStyle = 'rgba(255, 68, 68, 0.3)';
          ctx.beginPath();
          ctx.arc(personX, personY, 25, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ff4444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(personX, personY, 25, 0, Math.PI * 2);
          ctx.stroke();

          // Red blinking effect
          ctx.fillStyle = '#ff4444';
        } else {
          ctx.fillStyle = '#22c55e';
        }

        // Draw person circle
        ctx.beginPath();
        ctx.arc(personX, personY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw person ID
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 9px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(person.id?.slice(-2), personX, personY);
      });
    }

    // Draw rover
    if (mapData?.roverPosition) {
      const roverX = shaftX + 50;
      const roverY = startY + 150;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(roverX, roverY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(roverX, roverY, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Rover label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RVR', roverX, roverY + 25);
    }

    ctx.restore();
  }, [mapData, personnelData, zoom]);


  return (
    <div className="mine-map-container">
      <div className="map-header">
        <h2>🏭 Mine Cross-Section Map - Personnel Positions</h2>
        <div className="zoom-controls">
          <button onClick={() => handleZoom('out')} className="zoom-btn">−</button>
          <span className="zoom-level">{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => handleZoom('in')} className="zoom-btn">+</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="mine-canvas"
        width={800}
        height={500}
      />

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#fbbf24' }}></span>
          <span>Rescue Rover</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#22c55e' }}></span>
          <span>Personnel (Safe)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff4444' }}></span>
          <span>SOS Alert Active</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#d4a574' }}></span>
          <span>Mining Levels</span>
        </div>
      </div>

      <div className="map-info">
        <div className="info-row">
          <Users size={16} /> <span>Personnel: {Array.isArray(personnelData) ? personnelData.filter(p => p?.position).length : 0}</span>
        </div>
        <div className="info-row">
          <Siren size={16} style={{ color: '#ff4444' }} /> <span>SOS Active: {Array.isArray(personnelData) ? personnelData.filter(p => p?.sosTrigger).length : 0}</span>
        </div>
        <div className="info-row">
          <MapPin size={16} /> <span>Total Levels: 4</span>
        </div>
      </div>
    </div>
  );
}

export default function MineMap({ mapData, personnelData = [], dashboardMode = false, dashboardPeople = [], onPersonSos }) {
  if (dashboardMode) {
    return <DashboardPersonMap dashboardPeople={dashboardPeople} onPersonSos={onPersonSos} />;
  }

  return <MineMapCanvas mapData={mapData} personnelData={personnelData} />;
}
