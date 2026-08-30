import React from 'react';
import {
  LayoutDashboard,
  Thermometer,
  Map,
  Video,
  ShieldAlert,
  Bell,
  Radio,
  FileText,
  Settings,
  User
} from 'lucide-react';
import '../styles/Sidebar.css';

export default function Sidebar({ activeSection, onSectionChange }) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'environment', label: 'Sensors', icon: Thermometer },
    { id: 'map', label: 'Map & Rover', icon: Map },
    { id: 'camera', label: 'Camera Feed', icon: Video },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'rover', label: 'Rover Status', icon: Radio },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'user', label: 'User', icon: User }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">⛏️</div>
        <div className="brand-block">
          <span>MINE</span>
          <span>RESCUE</span>
          <span>SYSTEM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id || (section.id === 'dashboard' && activeSection === 'overview');

          return (
            <button
              key={section.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              title={section.label}
            >
              <Icon size={18} />
              <span className="nav-label">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="connection-indicator online" />
        <span>ROVER CONNECTION</span>
      </div>
    </aside>
  );
}
