import React from 'react';
import { MapPin, AlertTriangle, Users, AlertCircle, CornerUpRight, Zap } from 'lucide-react';
import '../styles/MineMap.css';

export default function MineMap({ mapData }) {
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
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom transform
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Draw tunnels as two parallel road lanes for a more realistic road look
    const roadOffset = 10 / zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    mapData.tunnels.forEach(tunnel => {
      const startX = tunnel.start[0];
      const startY = tunnel.start[1];
      const endX = tunnel.end[0];
      const endY = tunnel.end[1];
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.hypot(dx, dy) || 1;
      const nx = (-dy / length) * roadOffset;
      const ny = (dx / length) * roadOffset;

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 5 / zoom;
      ctx.beginPath();
      ctx.moveTo(startX + nx, startY + ny);
      ctx.lineTo(endX + nx, endY + ny);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5 / zoom;
      ctx.beginPath();
      ctx.moveTo(startX - nx, startY - ny);
      ctx.lineTo(endX - nx, endY - ny);
      ctx.stroke();
    });

    // Draw checkpoints
    ctx.fillStyle = '#4a9eff';
    mapData.checkpoints.forEach(cp => {
      ctx.beginPath();
      ctx.arc(cp.position[0], cp.position[1], 8 / zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw safe zones
    ctx.fillStyle = '#00dd00';
    mapData.safeZones.forEach(zone => {
      ctx.beginPath();
      ctx.arc(zone.position[0], zone.position[1], 12 / zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw hazards
    ctx.fillStyle = '#ff3333';
    mapData.hazards.forEach(hazard => {
      ctx.beginPath();
      ctx.arc(hazard.position[0], hazard.position[1], 10 / zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw survivors
    ctx.fillStyle = '#ffaa00';
    mapData.survivors.forEach(survivor => {
      ctx.beginPath();
      ctx.arc(survivor.position[0], survivor.position[1], 10 / zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw rover
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(mapData.roverPosition[0], mapData.roverPosition[1], 12 / zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2 / zoom;
    ctx.beginPath();
    ctx.arc(mapData.roverPosition[0], mapData.roverPosition[1], 20 / zoom, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, [mapData, zoom]);

  return (
    <div className="mine-map-container">
      <div className="map-header">
        <h2>Mine Tunnel Map & Rover Location</h2>
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
        height={600}
      />

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffff00' }}></span>
          <span>Rover Position</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffaa00' }}></span>
          <span>Survivor Detected</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff3333' }}></span>
          <span>Hazard Zone</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4a9eff' }}></span>
          <span>Checkpoint</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00dd00' }}></span>
          <span>Safe Zone</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffa500' }}></span>
          <span>Tunnel</span>
        </div>
      </div>

      <div className="map-info">
        <div className="info-row">
          <MapPin size={16} /> <span>Rover: {mapData.roverPosition[0]}m, {mapData.roverPosition[1]}m</span>
        </div>
        <div className="info-row">
          <AlertTriangle size={16} /> <span>Hazards: {mapData.hazards.length}</span>
        </div>
        <div className="info-row">
          <Users size={16} /> <span>Survivors: {mapData.survivors.length}</span>
        </div>
      </div>
    </div>
  );
}
