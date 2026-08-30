import React, { useState } from 'react';
import { Trash2, Download } from 'lucide-react';
import '../styles/EventLog.css';

export default function EventLog({ events }) {
  const [filter, setFilter] = useState('all');

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

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.severity === filter);

  const eventCounts = {
    CRITICAL: events.filter(e => e.severity === 'CRITICAL').length,
    HIGH: events.filter(e => e.severity === 'HIGH').length,
    MEDIUM: events.filter(e => e.severity === 'MEDIUM').length,
    LOW: events.filter(e => e.severity === 'LOW').length
  };

  return (
    <div className="event-log-container">
      <div className="log-header">
        <h2>Alert & Event Log</h2>
        <div className="log-actions">
          <button className="log-btn" title="Download Log">
            <Download size={18} /> Export
          </button>
          <button className="log-btn" title="Clear Log">
            <Trash2 size={18} /> Clear
          </button>
        </div>
      </div>

      <div className="event-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({events.length})
        </button>
        <button
          className={`filter-btn critical ${filter === 'CRITICAL' ? 'active' : ''}`}
          onClick={() => setFilter('CRITICAL')}
        >
          Critical ({eventCounts.CRITICAL})
        </button>
        <button
          className={`filter-btn high ${filter === 'HIGH' ? 'active' : ''}`}
          onClick={() => setFilter('HIGH')}
        >
          High ({eventCounts.HIGH})
        </button>
        <button
          className={`filter-btn medium ${filter === 'MEDIUM' ? 'active' : ''}`}
          onClick={() => setFilter('MEDIUM')}
        >
          Medium ({eventCounts.MEDIUM})
        </button>
        <button
          className={`filter-btn low ${filter === 'LOW' ? 'active' : ''}`}
          onClick={() => setFilter('LOW')}
        >
          Low ({eventCounts.LOW})
        </button>
      </div>

      <div className="event-table-container">
        <table className="event-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className={`severity-${event.severity.toLowerCase()}`}>
                  <td className="time-cell">
                    <span className="event-time">{event.time}</span>
                  </td>
                  <td className="event-cell">
                    <span className="event-name">{event.event}</span>
                  </td>
                  <td className="location-cell">
                    📍 {event.location}
                  </td>
                  <td className="severity-cell">
                    <span className="severity-badge">
                      {getSeverityIcon(event.severity)} {event.severity}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge status-${event.status.toLowerCase()}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn view">View</button>
                    <button className="action-btn ack">Acknowledge</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-events">
                <td colSpan="6">No events found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="log-stats">
        <div className="stat-box">
          <span className="stat-label">Total Events:</span>
          <span className="stat-value">{events.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active Alerts:</span>
          <span className="stat-value alert">
            {events.filter(e => e.status === 'ACTIVE').length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Resolved:</span>
          <span className="stat-value resolved">
            {events.filter(e => e.status === 'RESOLVED').length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Last Update:</span>
          <span className="stat-value">Just now</span>
        </div>
      </div>

      <div className="log-disclaimer">
        <strong>📝 Note:</strong> This event log displays simulated events for demonstration purposes. 
        Real events from sensors, detections, and system operations will be logged here when hardware is connected.
      </div>
    </div>
  );
}
