import React, { useEffect, useMemo, useRef, useState } from 'react';
import roverVehicle from './assets/rover-vehicle.svg';
import { mockCameraFeeds, mockPersonnelData, mockMineMap } from './data/mockData';
import MineMap from './components/MineMap';
import {
  Activity,
  AlertTriangle,
  BellRing,
  Camera,
  ChevronDown,
  Clock3,
  FileText,
  Gauge,
  GaugeCircle,
  Map,
  Minus,
  Plus,
  Radio,
  Settings,
  ShieldAlert,
  Siren,
  Thermometer,
  User,
  Wifi,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Gauge, section: 'dashboard' },
  { label: 'Sensors', icon: Thermometer, section: 'sensors' },
  { label: 'Map & Rover', icon: Map, section: 'map' },
  { label: 'Camera Feed', icon: Camera, section: 'camera' },
  { label: 'Alerts', icon: BellRing, section: 'alerts' },
  { label: 'Rover Status', icon: Radio, section: 'rover' },
  { label: 'Reports', icon: FileText, section: 'reports' },
  { label: 'Settings', icon: Settings, section: 'settings' },
  { label: 'User', icon: User, section: 'user' },
];

const statusConfig = {
  normal: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30',
  warning: 'text-amber-300 bg-amber-500/10 border-amber-400/30',
  critical: 'text-rose-300 bg-rose-500/10 border-rose-400/30',
};

const initialDispatchLog = [
  { id: 1, label: 'Control Room', status: 'Sent', message: 'SMS sent to emergency control' },
  { id: 2, label: 'Nearby Officials', status: 'In Transit', message: 'Dispatching rescue coordinator' },
  { id: 3, label: 'Service Center', status: 'Queued', message: 'Maintenance team on standby' },
];

const officialsPhone = import.meta.env.VITE_OFFICIALS_PHONE || '+15550100';

function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mapZoom, setMapZoom] = useState(1);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [dispatchLog, setDispatchLog] = useState(initialDispatchLog);
  const [selectedGasTab, setSelectedGasTab] = useState('METHANE');
  const [personnelData, setPersonnelData] = useState(mockPersonnelData);
  const [dashboardPeople, setDashboardPeople] = useState([
    ['P-01', 'Ajay Kumar', 'Tunnel A - North Face', '18%', '32%'], ['P-02', 'Ramesh Singh', 'Tunnel B - East Branch', '68%', '24%'], ['P-03', 'Vikram Patel', 'Tunnel C - Main Drift', '43%', '68%'],
    ['P-04', 'Sunil Nair', 'Tunnel A - West Cut', '79%', '70%'], ['P-05', 'Deepak Sharma', 'Tunnel B - Lower Face', '27%', '78%'], ['P-06', 'Mohan Gupta', 'Tunnel C - Crosscut', '56%', '43%'],
  ].map(([id, name, location, left, top]) => ({ id, name, location, status: 'safe', position: { left, top } })));
  const [mapData] = useState(mockMineMap);
  const [liveGasData, setLiveGasData] = useState({
    METHANE: [2.28, 2.3, 2.34, 2.31, 2.29, 2.33, 2.35, 2.36, 2.38, 2.34, 2.32, 2.36, 2.4, 2.39, 2.35, 2.31, 2.27, 2.29, 2.34, 2.38, 2.37, 2.35, 2.33, 2.36],
    CARBON: [38, 40, 42, 41, 43, 45, 44, 46, 47, 45, 44, 46, 48, 47, 46, 44, 42, 43, 45, 46, 45, 44, 43, 45],
    OXYGEN: [19.2, 19.0, 18.8, 18.6, 18.5, 18.3, 18.4, 18.2, 18.1, 18.5, 18.7, 18.6, 18.4, 18.3, 18.5, 18.6, 18.8, 18.7, 18.5, 18.3, 18.2, 18.4, 18.6, 18.6],
    WATER: [12.1, 12.3, 12.6, 12.8, 13.1, 13.4, 13.6, 13.8, 14.1, 14.2, 14.0, 13.9, 13.8, 13.6, 13.4, 13.2, 13.5, 13.7, 13.9, 14.1, 14.2, 14.0, 13.9, 14.2],
    TEMPERATURE: [28.2, 28.5, 28.8, 29.1, 29.4, 29.7, 30.1, 30.4, 30.8, 31.1, 31.5, 31.8, 32.1, 32.4, 32.2, 32.0, 31.8, 31.5, 31.2, 30.9, 30.6, 30.3, 30.0, 29.7],
    RESPIRABLE: [2.1, 2.3, 2.4, 2.6, 2.8, 3.0, 3.2, 3.3, 3.5, 3.6, 3.5, 3.4, 3.5, 3.6, 3.7, 3.8, 3.7, 3.6, 3.5, 3.4, 3.5, 3.6, 3.7, 3.8],
  });
  const [cameraFeeds, setCameraFeeds] = useState(mockCameraFeeds);
  const [selectedCameraId, setSelectedCameraId] = useState(mockCameraFeeds[0]?.id ?? 1);
  const selectedCamera = cameraFeeds.find((camera) => camera.id === selectedCameraId) ?? cameraFeeds[0];
  const [alerts, setAlerts] = useState([
    { type: 'critical', title: 'High Gas Concentration Detected', location: 'Zone B, Tunnel 2', time: '04:34 PM' },
    { type: 'warning', title: 'Humidity Above Threshold', location: 'Tunnel C, Zone 1', time: '04:32 PM' },
    { type: 'safe', title: 'Rover Reached Checkpoint 4', location: 'Tunnel A', time: '04:30 PM' },
  ]);
  const sectionRefs = useRef({});

  const handleMapZoom = (direction) => {
    setMapZoom((current) => {
      if (direction === 'in') return Math.min(1.5, Number((current + 0.1).toFixed(2)));
      if (direction === 'out') return Math.max(0.8, Number((current - 0.1).toFixed(2)));
      return current;
    });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);

    const target = sectionRefs.current[section];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEmergencyTrigger = () => {
    const emergencyStamp = new Date();
    const timeLabel = emergencyStamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setSosTriggered(true);
    setActiveSection('alerts');
    setAlerts((current) => [
      {
        type: 'critical',
        title: 'Emergency SOS Triggered - Miner Help Requested',
        location: 'Tunnel B • Zone 2',
        time: timeLabel,
      },
      ...current.slice(0, 2),
    ]);

    setDispatchLog([
      { id: 1, label: 'Control Room', status: 'Sent', message: 'SMS alert sent to rescue control' },
      { id: 2, label: 'Nearby Officials', status: 'Sent', message: `Officer dispatch active near ${timeLabel}` },
      { id: 3, label: 'Service Center', status: 'Sent', message: 'Medical / maintenance team notified' },
    ]);

    setMetrics((current) =>
      current.map((item) => {
        if (item.id === 'temperature') return { ...item, value: 39.2, status: 'CRITICAL', statusTone: 'critical' };
        if (item.id === 'humidity') return { ...item, value: 81, status: 'HIGH', statusTone: 'warning' };
        if (item.id === 'gas') return { ...item, value: 238, status: 'CRITICAL', statusTone: 'critical' };
        if (item.id === 'air') return { ...item, value: 'POOR', status: 'ALERT', statusTone: 'warning' };
        if (item.id === 'structure') return { ...item, value: 'VIBRATION', status: 'ALERT', statusTone: 'warning' };
        return item;
      })
    );
  };

  const handleDashboardPersonSos = (personId) => {
    const person = dashboardPeople.find((item) => item.id === personId);
    if (!person) return;

    const timeLabel = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setDashboardPeople((current) => current.map((item) => (
      item.id === personId ? { ...item, status: 'sos' } : item
    )));
    setAlerts((current) => [
      { type: 'critical', title: `SOS: ${person.name}`, location: person.location, time: timeLabel },
      ...current.slice(0, 2),
    ]);
    setDispatchLog((current) => current.map((item) => ({
      ...item,
      status: 'Sent',
      message: item.id === 1 ? `SMS sent for ${person.id} to emergency control` : `SOS dispatch active near ${person.location}`,
    })));

    window.location.href = `sms:${officialsPhone}?body=${encodeURIComponent(`MINEGUARD SOS - ${person.name} (${person.id}) needs immediate assistance at ${person.location}. Time: ${timeLabel}`)}`;
  };

  const [metrics, setMetrics] = useState([
    {
      id: 'temperature',
      label: 'Temperature',
      value: 28.5,
      unit: '°C',
      range: 'Range: 20°C – 50°C',
      status: 'NORMAL',
      statusTone: 'normal',
      accent: 'text-orange-300',
      iconBg: 'bg-orange-500/15 text-orange-300',
      trail: [24, 26, 28, 27, 29, 31, 32],
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: 64,
      unit: '%',
      range: 'Range: 30% – 90%',
      status: 'NORMAL',
      statusTone: 'normal',
      accent: 'text-sky-300',
      iconBg: 'bg-sky-500/15 text-sky-300',
      trail: [50, 54, 58, 60, 64, 62, 65],
    },
    {
      id: 'gas',
      label: 'Gas Level',
      value: 120,
      unit: 'ppm',
      range: 'Range: 0 – 1000 ppm',
      status: 'NORMAL',
      statusTone: 'normal',
      accent: 'text-yellow-300',
      iconBg: 'bg-yellow-500/15 text-yellow-300',
      trail: [90, 78, 99, 110, 118, 122, 120],
    },
    {
      id: 'air',
      label: 'Air Quality',
      value: 'GOOD',
      unit: '',
      range: 'AQI: 42',
      status: 'GOOD',
      statusTone: 'normal',
      accent: 'text-teal-300',
      iconBg: 'bg-teal-500/15 text-teal-300',
      trail: [32, 34, 39, 42, 40, 38, 41],
    },
    {
      id: 'structure',
      label: 'Structural Status',
      value: 'STABLE',
      unit: '',
      range: 'Vibration: Low',
      status: 'STABLE',
      statusTone: 'normal',
      accent: 'text-violet-300',
      iconBg: 'bg-violet-500/15 text-violet-300',
      trail: [12, 14, 17, 16, 15, 14, 13],
    },
  ]);

  const trendSeries = [
    { label: 'Temperature', color: '#fbbf24', values: [38, 40, 39, 41, 46, 43, 44, 47, 48, 45, 46, 50] },
    { label: 'Humidity', color: '#60a5fa', values: [52, 55, 57, 58, 61, 63, 60, 62, 68, 66, 64, 65] },
    { label: 'Gas Level', color: '#34d399', values: [70, 82, 76, 80, 94, 102, 108, 110, 116, 120, 124, 118] },
    { label: 'Air Quality', color: '#a78bfa', values: [34, 36, 39, 42, 41, 44, 48, 46, 45, 43, 40, 42] },
  ];

  const gasData = {
    METHANE: {
      label: 'Methane',
      unit: ' %',
      value: 1.01,
      rate: '+0.014 %/min',
      color: '#f7b533',
      data: [0.98, 0.99, 1.01, 1.02, 1.00, 1.04, 1.05, 1.08, 1.09, 1.06, 1.02, 1.05, 1.07, 1.09, 1.08, 1.06, 1.03, 1.01, 1.02, 1.06, 1.08, 1.09, 1.07, 1.01],
      warning: 1.05,
      critical: 1.15,
      minY: 0.92,
      maxY: 1.35,
    },
    CARBON: {
      label: 'Carbon Monoxide',
      unit: ' ppm',
      value: 45.8,
      rate: '+0.087 ppm/min',
      color: '#ef4444',
      data: [38, 40, 42, 41, 43, 45, 44, 46, 47, 45, 44, 46, 48, 47, 46, 44, 42, 43, 45, 46, 45, 44, 43, 45],
      warning: 35,
      critical: 50,
      minY: 35,
      maxY: 52,
    },
    OXYGEN: {
      label: 'Oxygen',
      unit: ' %',
      value: 18.6,
      rate: '-0.012 %/min',
      color: '#3b82f6',
      data: [19.2, 19.0, 18.8, 18.6, 18.5, 18.3, 18.4, 18.2, 18.1, 18.5, 18.7, 18.6, 18.4, 18.3, 18.5, 18.6, 18.8, 18.7, 18.5, 18.3, 18.2, 18.4, 18.6, 18.6],
      warning: 17,
      critical: 15,
      minY: 17.8,
      maxY: 19.4,
    },
    WATER: {
      label: 'Water Vapor',
      unit: ' g/m³',
      value: 14.2,
      rate: '+0.042 g/m³/min',
      color: '#06b6d4',
      data: [12.1, 12.3, 12.6, 12.8, 13.1, 13.4, 13.6, 13.8, 14.1, 14.2, 14.0, 13.9, 13.8, 13.6, 13.4, 13.2, 13.5, 13.7, 13.9, 14.1, 14.2, 14.0, 13.9, 14.2],
      warning: 15,
      critical: 18,
      minY: 11.8,
      maxY: 14.6,
    },
    TEMPERATURE: {
      label: 'Temperature',
      unit: ' °C',
      value: 32.4,
      rate: '+0.156 °C/min',
      color: '#f97316',
      data: [28.2, 28.5, 28.8, 29.1, 29.4, 29.7, 30.1, 30.4, 30.8, 31.1, 31.5, 31.8, 32.1, 32.4, 32.2, 32.0, 31.8, 31.5, 31.2, 30.9, 30.6, 30.3, 30.0, 29.7],
      warning: 35,
      critical: 40,
      minY: 27.8,
      maxY: 33.2,
    },
    RESPIRABLE: {
      label: 'Respirable Dust',
      unit: ' mg/m³',
      value: 3.8,
      rate: '+0.024 mg/m³/min',
      color: '#a855f7',
      data: [2.1, 2.3, 2.4, 2.6, 2.8, 3.0, 3.2, 3.3, 3.5, 3.6, 3.5, 3.4, 3.5, 3.6, 3.7, 3.8, 3.7, 3.6, 3.5, 3.4, 3.5, 3.6, 3.7, 3.8],
      warning: 4,
      critical: 5.5,
      minY: 1.8,
      maxY: 4.2,
    },
  };

  const currentGas = gasData[selectedGasTab];

  const liveMetrics = useMemo(() => {
    const chartData = liveGasData[selectedGasTab];
    const currentValue = chartData[chartData.length - 1];
    const previousValue = chartData[chartData.length - 2];
    const rateOfChange = (currentValue - previousValue) * 50;
    const rateSign = rateOfChange >= 0 ? '+' : '';

    return {
      value: Number(currentValue).toFixed(2),
      rate: `${rateSign}${Math.abs(rateOfChange).toFixed(3)} ${currentGas.unit}/min`,
      delta: currentValue - previousValue,
    };
  }, [liveGasData, selectedGasTab, currentGas.unit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());

      // Real-time hardware telemetry simulation
      setLiveGasData((prev) => ({
        METHANE: [...prev.METHANE.slice(1), prev.METHANE[prev.METHANE.length - 1] + (Math.random() - 0.45) * 0.08],
        CARBON: [...prev.CARBON.slice(1), prev.CARBON[prev.CARBON.length - 1] + (Math.random() - 0.45) * 1.2],
        OXYGEN: [...prev.OXYGEN.slice(1), prev.OXYGEN[prev.OXYGEN.length - 1] + (Math.random() - 0.52) * 0.15],
        WATER: [...prev.WATER.slice(1), prev.WATER[prev.WATER.length - 1] + (Math.random() - 0.48) * 0.3],
        TEMPERATURE: [...prev.TEMPERATURE.slice(1), prev.TEMPERATURE[prev.TEMPERATURE.length - 1] + (Math.random() - 0.45) * 0.6],
        RESPIRABLE: [...prev.RESPIRABLE.slice(1), prev.RESPIRABLE[prev.RESPIRABLE.length - 1] + (Math.random() - 0.47) * 0.12],
      }));

      setMetrics((current) =>
        current.map((item) => {
          const variance = (Math.random() - 0.5) * 4;

          if (item.id === 'temperature') {
            return { ...item, value: Number((28.5 + variance).toFixed(1)) };
          }
          if (item.id === 'humidity') {
            return { ...item, value: Math.max(40, Math.min(85, 64 + Math.round(variance * 2))) };
          }
          if (item.id === 'gas') {
            return { ...item, value: Math.max(60, Math.min(180, 120 + Math.round(variance * 4))) };
          }
          return item;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const timeString = useMemo(
    () => now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [now]
  );

  const dateString = useMemo(
    () => now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    [now]
  );

  const trendSvg = useMemo(() => {
    const width = 380;
    const height = 170;
    const padding = 18;

    return trendSeries.map((series) => {
      const max = Math.max(...series.values) + 8;
      const min = Math.min(...series.values) - 8;

      const points = series.values
        .map((point, index) => {
          const x = padding + (index * (width - padding * 2)) / (series.values.length - 1);
          const y = height - padding - ((point - min) / (max - min || 1)) * (height - padding * 2);
          return `${x},${y}`;
        })
        .join(' ');

      return { ...series, points };
    });
  }, []);

  const methaneChart = useMemo(() => {
    const width = 620;
    const height = 190;
    const paddingLeft = 30;
    const paddingRight = 12;
    const paddingTop = 18;
    const paddingBottom = 28;
    const min = Math.min(currentGas.minY, ...liveGasData[selectedGasTab]) * 0.98;
    const max = Math.max(currentGas.maxY, ...liveGasData[selectedGasTab]) * 1.02;

    const chartData = liveGasData[selectedGasTab];
    const points = chartData.map((value, index) => {
      const x = paddingLeft + (index * (width - paddingLeft - paddingRight)) / (chartData.length - 1);
      const y = height - paddingBottom - ((value - min) / (max - min || 1)) * (height - paddingTop - paddingBottom);
      return { x, y, value };
    });

    const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
    const areaPath = [
      `M ${points[0].x} ${height - paddingBottom}`,
      ...points.map((point) => `L ${point.x} ${point.y}`),
      `L ${points[points.length - 1].x} ${height - paddingBottom}`,
      'Z',
    ].join(' ');

    const warningY = height - paddingBottom - ((currentGas.warning - min) / (max - min || 1)) * (height - paddingTop - paddingBottom);
    const criticalY = height - paddingBottom - ((currentGas.critical - min) / (max - min || 1)) * (height - paddingTop - paddingBottom);

    return { width, height, linePoints, areaPath, points, min, max, warningY, criticalY };
  }, [selectedGasTab, currentGas, liveGasData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden border-x border-slate-800/80 bg-[#0b1220]">
        <aside className="hidden w-[220px] flex-col border-r border-slate-800 bg-[#0d1723] lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-lg text-cyan-300">⛏️</div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-slate-200">
              <div>MINE</div>
              <div>RESCUE</div>
              <div>SYSTEM</div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4">
            {navItems.map(({ label, icon: Icon, section }) => {
              const isActive = activeSection === section;

              return (
                <button
                  key={label}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[inset_0_0_16px_rgba(34,211,238,0.08)]'
                      : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                  type="button"
                  onClick={() => handleSectionChange(section)}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 px-4 py-4">
            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 data-pulse" />
              <span>ROVER CONNECTION</span>
              <span className="text-emerald-300">CONNECTED</span>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-[#0b1220]">
          <header className="border-b border-slate-800 bg-[#0b1220]/90 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
                <span className="text-cyan-300">OPERATIONS</span>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock3 size={12} className="text-cyan-300" />
                  <span>{timeString}</span>
                </div>
                <span className="text-slate-500">•</span>
                <span>{dateString}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hardware-live-indicator">
                  <span className="hardware-live-dot" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200">Hardware Connected</span>
                  <span className="text-[8px] text-emerald-300">Telemetry Active</span>
                </div>
                <button
                  type="button"
                  onClick={handleEmergencyTrigger}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] transition ${
                    sosTriggered
                      ? 'border-red-400/40 bg-red-500/15 text-red-200'
                      : 'border-amber-400/35 bg-amber-500/10 text-amber-200'
                  }`}
                >
                  <Siren size={14} />
                  {sosTriggered ? 'SOS ACTIVE' : 'EMERGENCY'}
                </button>
              </div>
            </div>
          </header>

          <div className="dashboard-grid-pattern flex-1 overflow-y-auto px-4 py-4">
            {(() => {
              switch (activeSection) {
                case 'dashboard':
                  return (
                    <div className="space-y-4">
                      <section className="reference-shell rounded-2xl border border-slate-800 bg-[#0d1723]/90 p-3">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-lg text-cyan-300">⛏️</div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">MineGuard</div>
                              <div className="text-[9px] text-slate-500">Mine Control – Live Monitoring</div>
                            </div>
                          </div>

                          <div className="grid w-full gap-2 sm:grid-cols-2 xl:max-w-[760px] xl:grid-cols-6">
                            {[
                              ['Crew', '18', 'alert'],
                              ['Rover', '6', 'normal'],
                              ['Gas', '2.34%', 'danger'],
                              ['Water', '218 cm', 'normal'],
                              ['Temp', '19.2°C', 'warning'],
                              ['Time', '17:48:43', 'normal'],
                            ].map(([label, value, tone]) => (
                              <div key={label} className="summary-stat">
                                <div className="summary-label">{label}</div>
                                <div className={`summary-value ${tone}`}>{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="grid gap-4 xl:grid-cols-[1.9fr_1.1fr]">
                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <div className="text-[8px] font-semibold uppercase tracking-[0.24em] text-slate-400">LIVE UNDERGROUND MAP</div>
                              <h2 className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-100">Block IV — Seam XIV / XV / XVI</h2>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="text-[8px] uppercase tracking-[0.12em] text-slate-400">DETECTED</div>
                                <div className="text-[18px] font-bold text-amber-300">6</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleMapZoom('out')} className="flex h-6 w-6 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" type="button"><Minus size={12} /></button>
                                <span className="px-1.5 text-[9px] font-medium text-slate-300 w-10 text-center">{Math.round(mapZoom * 100)}%</span>
                                <button onClick={() => handleMapZoom('in')} className="flex h-6 w-6 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" type="button"><Plus size={12} /></button>
                              </div>
                            </div>
                          </div>

                          <MineMap
                            mapData={mapData}
                            personnelData={personnelData}
                            dashboardMode
                            dashboardPeople={dashboardPeople}
                            onPersonSos={handleDashboardPersonSos}
                          />
                        </div>

                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Real-Time Alerts</h2>
                            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-red-300">18</span>
                          </div>

                          <div className="alert-stack">
                            {[
                              { title: 'Water Level rising', detail: 'Plate 7/2 · 0.7m rise', severity: 'critical' },
                              { title: 'Carbon Monoxide', detail: 'Tunnel 2 · 189 ppm', severity: 'critical' },
                              { title: 'Ventilation check', detail: 'Service bay · Stable', severity: 'safe' },
                              { title: 'Humidity threshold', detail: 'Block A · 81%', severity: 'warning' },
                            ].map((item) => (
                              <div key={item.title} className={`alert-row ${item.severity}`}>
                                <div className="alert-row-icon">{item.severity === 'critical' ? '!' : item.severity === 'warning' ? '!' : '✓'}</div>
                                <div className="min-w-0 flex-1">
                                  <div className="alert-title">{item.title}</div>
                                  <div className="alert-detail">{item.detail}</div>
                                </div>
                                <div className="alert-tag">{item.severity === 'critical' ? 'Alert' : item.severity === 'warning' ? 'Warn' : 'OK'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="grid gap-4 xl:grid-cols-[1.85fr_1.15fr]">
                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-[#0f1724] p-3.5">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">24/7 Sensor Telemetry</div>
                              <h2 className="mt-2 text-[18px] font-semibold text-slate-100">{currentGas.label} trend</h2>
                            </div>
                            <div className="text-right">
                              <div className="text-[20px] font-bold" style={{ color: currentGas.color }}>
                                {liveMetrics.value}{currentGas.unit}
                              </div>
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">rate {liveMetrics.rate}</div>
                            </div>
                          </div>

                          <div className="mb-3 flex flex-wrap gap-2">
                            {['METHANE', 'CARBON', 'OXYGEN', 'WATER', 'TEMPERATURE', 'RESPIRABLE'].map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setSelectedGasTab(tab)}
                                type="button"
                                className={`rounded border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition ${
                                  selectedGasTab === tab
                                    ? 'bg-[#1e293b]'
                                    : 'border-slate-700 bg-slate-900/50 text-slate-400'
                                }`}
                                style={selectedGasTab === tab ? { borderColor: currentGas.color, color: currentGas.color } : {}}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-[#0b1520] p-2">
                            <svg viewBox={`0 0 ${methaneChart.width} ${methaneChart.height}`} className="h-[220px] w-full">
                              <defs>
                                <linearGradient id={`chart-fill-${selectedGasTab}`} x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor={currentGas.color} stopOpacity="0.44" />
                                  <stop offset="100%" stopColor={currentGas.color} stopOpacity="0.03" />
                                </linearGradient>
                                <filter id={`chart-glow-${selectedGasTab}`} x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur stdDeviation="3" result="blur" />
                                  <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                                </filter>
                              </defs>

                              {[0, 1, 2, 3].map((row) => {
                                const y = 18 + row * 40;
                                return <line key={row} x1="30" x2="608" y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />;
                              })}

                              {currentGas.warning && currentGas.warning > methaneChart.min && currentGas.warning < methaneChart.max ? (
                                <line x1="30" x2="608" y1={methaneChart.warningY} y2={methaneChart.warningY} stroke="rgba(251,191,36,0.72)" strokeDasharray="6 6" strokeWidth="1.2" />
                              ) : null}
                              {currentGas.critical && currentGas.critical > methaneChart.min && currentGas.critical < methaneChart.max ? (
                                <line x1="30" x2="608" y1={methaneChart.criticalY} y2={methaneChart.criticalY} stroke="rgba(248,113,113,0.8)" strokeDasharray="4 5" strokeWidth="1.1" />
                              ) : null}

                              <path d={methaneChart.areaPath} fill={`url(#chart-fill-${selectedGasTab})`} />
                              <polyline
                                fill="none"
                                stroke={currentGas.color}
                                strokeWidth="2.6"
                                points={methaneChart.linePoints}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                filter={`url(#chart-glow-${selectedGasTab})`}
                              />
                              {methaneChart.points.map((point, index) => {
                                if (index !== methaneChart.points.length - 1) return null;

                                return (
                                  <g key={`${point.x}-${point.y}`}>
                                    <line x1={point.x} x2={point.x} y1="18" y2="170" stroke="rgba(251,191,36,0.7)" strokeDasharray="5 5" strokeWidth="1.1" />
                                    <circle cx={point.x} cy={point.y} r="5.8" fill={currentGas.color} opacity="0.18" />
                                    <circle cx={point.x} cy={point.y} r="3.1" fill={currentGas.color} />
                                    <rect
                                      x={Math.min(point.x + 8, 475)}
                                      y={Math.max(point.y - 30, 24)}
                                      width="92"
                                      height="26"
                                      rx="4"
                                      fill="rgba(15,23,42,0.9)"
                                      stroke="rgba(251,191,36,0.6)"
                                    />
                                    <text x={Math.min(point.x + 16, 484)} y={Math.max(point.y - 12, 40)} fontSize="10" fill="#f8fafc">
                                      {currentGas.label.toLowerCase()} : {point.value.toFixed(2)}{currentGas.unit}
                                    </text>
                                  </g>
                                );
                              })}
                              {[0, 1, 2, 3, 4, 5, 6].map((index) => {
                                const x = 30 + index * ((methaneChart.width - 42) / 6);
                                const label = ['20:04:43', '20:05:03', '20:05:23', '20:05:43', '20:06:03', '20:06:23', '20:06:43'][index] || '';
                                return <text key={label || index} x={x} y={190} textAnchor="middle" fontSize="9" fill="rgba(148,163,184,0.8)">{label}</text>;
                              })}
                              {Array.from({ length: 5 }, (_, i) => {
                                const range = methaneChart.max - methaneChart.min;
                                const step = range / 4;
                                const labelValue = methaneChart.max - i * step;
                                const y = 18 + i * 40;
                                return <text key={labelValue} x="8" y={y + 4} fontSize="9" fill="rgba(148,163,184,0.8)">{labelValue.toFixed(2)}</text>;
                              })}
                            </svg>
                          </div>

                          <div className="mt-2 flex items-center gap-4 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                            <span>Warning {currentGas.warning}{currentGas.unit}</span>
                            <span>Critical {currentGas.critical}{currentGas.unit}</span>
                          </div>
                        </div>

                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Emergency Dispatch</h2>
                            <button
                              type="button"
                              onClick={handleEmergencyTrigger}
                              className="rounded-lg border border-red-400/30 bg-red-500/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-red-200"
                            >
                              {sosTriggered ? 'SOS ACTIVE' : 'SIMULATE SOS'}
                            </button>
                          </div>

                          <div className={`mb-3 rounded-xl border p-3 ${sosTriggered ? 'border-red-400/30 bg-red-500/8' : 'border-emerald-400/30 bg-emerald-500/8'}`}>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[9px] uppercase tracking-[0.14em] text-slate-300">Incident Status</span>
                              <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] ${sosTriggered ? 'border-red-400/30 bg-red-500/10 text-red-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'}`}>
                                {sosTriggered ? 'Escalated' : 'Normal'}
                              </span>
                            </div>
                            <div className="text-lg font-semibold text-slate-100">{sosTriggered ? 'Emergency alert dispatched to officials' : 'No active emergency alert'}</div>
                            <div className="mt-2 text-[10px] uppercase tracking-[0.12em] text-slate-400">{sosTriggered ? 'Tunnel B · Zone 2 · Rescue team notified' : 'All systems stable'}</div>
                          </div>

                          <div className="space-y-2.5">
                            {dispatchLog.map((item) => (
                              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{item.label}</span>
                                  <span className={`rounded-full border px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] ${item.status === 'Sent' ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' : 'border-amber-400/30 bg-amber-500/10 text-amber-200'}`}>
                                    {item.status}
                                  </span>
                                </div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-100">{item.message}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="grid gap-4 xl:grid-cols-[1.6fr_1.4fr]">
                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Tunnel Inspection Rover</h2>
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300">ONLINE</span>
                          </div>
                          <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="rover-inspection-scene">
                                <img
                                  src={roverVehicle}
                                  alt="MineGuard inspection rover"
                                  className="max-h-56 w-full object-contain drop-shadow-[0_0_28px_rgba(59,130,246,0.28)]"
                                />
                              </div>
                            </div>
                            <div className="space-y-2 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                              <div className="inspection-alert">
                                <span className="inspection-alert-badge">Issue detected</span>
                                <div className="mt-1 text-[11px] font-semibold text-red-200">Front-right wheel resistance +18%</div>
                                <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-slate-400">Tunnel B · checkpoint 3</div>
                              </div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Battery</span><span className="font-bold text-slate-100">78%</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Speed</span><span className="font-bold text-slate-100">0.8 m/s</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Location</span><span className="font-bold text-slate-100">Tunnel B</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Distance</span><span className="font-bold text-slate-100">245.6 m</span></div>
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2"><div className="text-slate-400">Signal</div><div className="mt-1 inline-flex items-center gap-1 font-bold text-slate-100"><Wifi size={11} /> Stable</div></div>
                                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2"><div className="text-slate-400">Status</div><div className="mt-1 font-bold text-slate-100">Inspecting</div></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Inspection Checklist</h2>
                            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-300">7/8 OK</span>
                          </div>

                          <div className="space-y-2">
                            {[
                              ['Chassis integrity', 'Stable', 'ok'],
                              ['Front camera turret', 'Clear', 'ok'],
                              ['LIDAR / scanner', 'Aligned', 'ok'],
                              ['Wheel assembly', 'Heat warning', 'warn'],
                              ['Battery voltage', '78%', 'ok'],
                              ['Signal relay', 'Stable', 'ok'],
                              ['Gas sensor array', 'Normal', 'ok'],
                              ['Thermal scan', 'Fine', 'ok'],
                            ].map(([name, value, state]) => (
                              <div key={name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                                <div>
                                  <div className="text-[11px] font-semibold text-slate-100">{name}</div>
                                  <div className="text-[8px] uppercase tracking-[0.12em] text-slate-400">{value}</div>
                                </div>
                                <div className={`rounded-full border px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] ${state === 'warn' ? 'border-amber-400/30 bg-amber-500/10 text-amber-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'}`}>
                                  {state === 'warn' ? 'check' : 'ok'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>
                  );
                case 'sensors':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.sensors = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Sensors</h2>
                          <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">Live</div>
                        </div>
                        <p className="text-sm text-slate-300">Environmental sensors and field telemetry are being monitored in real time.</p>
                      </div>

                      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {metrics.map((metric) => (
                          <div key={metric.id} className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                            <div className="mb-3 flex items-center justify-between">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${metric.iconBg}`}>
                                {metric.id === 'temperature' && <Thermometer size={14} />}
                                {metric.id === 'humidity' && <GaugeCircle size={14} />}
                                {metric.id === 'gas' && <AlertTriangle size={14} />}
                                {metric.id === 'air' && <Activity size={14} />}
                                {metric.id === 'structure' && <ShieldAlert size={14} />}
                              </div>
                              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] ${statusConfig[metric.statusTone]}`}>{metric.status}</span>
                            </div>
                            <div className="mb-2 flex items-end gap-1">
                              <span className="text-[22px] font-bold leading-none text-slate-50">{metric.value}</span>
                              {metric.unit && <span className="pb-1 text-[10px] uppercase text-slate-400">{metric.unit}</span>}
                            </div>
                            <div className="mb-3 text-[9px] uppercase tracking-[0.12em] text-slate-400">{metric.range}</div>
                          </div>
                        ))}
                      </section>
                    </div>
                  );
                case 'map':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.map = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Map & Rover</h2>
                          <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">Tracking</div>
                        </div>
                        <div className="map-grid-pattern relative h-[420px] overflow-hidden rounded-xl border border-slate-800 bg-[#091318]">
                          <div className="mine-network absolute inset-0">
                            <div className="mine-corridor mine-corridor-main" />
                            <div className="mine-corridor mine-corridor-upper" />
                            <div className="mine-corridor mine-corridor-lower" />
                            <div className="mine-corridor mine-corridor-branch-left" />
                            <div className="mine-corridor mine-corridor-branch-right" />
                          </div>

                          <div className="absolute left-4 top-6 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">North Gallery</div>
                          <div className="absolute left-[38%] top-[20%] text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel A</div>
                          <div className="absolute right-6 bottom-8 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Pump House</div>

                          <div className="hazard-ring absolute left-[52%] top-[42%]" />
                          <div className="absolute left-[56%] top-[48%] text-[10px] font-bold text-red-200">!</div>

                          <div className="absolute left-[12%] top-[60%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[38%] top-[28%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[63%] top-[52%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[54%] top-[64%] h-3.5 w-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]" />
                          <div className="absolute left-[30%] top-[50%] h-4 w-4 rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.8)]" />

                          <div className="rover-animate absolute left-[18%] top-[48%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                            <img src={roverVehicle} alt="MineGuard rover on map" className="rover-spin h-16 w-28 object-contain drop-shadow-[0_0_24px_rgba(74,222,128,0.7)]" />
                          </div>

                          <div className="absolute bottom-4 left-4 flex gap-3 text-[9px] uppercase tracking-[0.14em] text-slate-300">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Rover</span>
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-400" /> Gas</span>
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" /> Worker</span>
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-300" /> Checkpoint</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                case 'camera':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.camera = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Camera Feed</h2>
                          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400 data-pulse" /> LIVE</div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
                          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-800 bg-[#030b12] shadow-[inset_0_0_30px_rgba(34,211,238,0.08),0_0_25px_rgba(14,116,144,0.25)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.13),_rgba(2,6,23,0.9)_38%,_rgba(2,6,23,1)_100%)]" />
                            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
                            <div className="absolute inset-[6%] rounded-2xl border border-cyan-400/15 bg-slate-950/20" />
                            <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
                            <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
                            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/60 to-transparent" />
                            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

                            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
                            </div>

                            <div className="absolute right-4 top-4 z-10 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                              {selectedCamera.status}
                            </div>

                            <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                              <span>{selectedCamera.name}</span>
                              <span className="text-cyan-300">HD / 30 FPS</span>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/35 bg-cyan-500/5 shadow-[0_0_40px_rgba(34,211,238,0.18)]" />
                            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/35 bg-emerald-500/8" />
                            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md border border-cyan-400/30 bg-cyan-400/5" />

                            <div className="absolute inset-x-5 bottom-5 z-10 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-200">
                              <span>ROVER CAMERA</span>
                              <span className={` ${selectedCamera.active ? 'text-emerald-300' : 'text-amber-300'}`}>
                                {selectedCamera.active ? 'STREAMING' : 'STANDBY'}
                              </span>
                            </div>

                            <div className="absolute inset-0 animate-pulse bg-[linear-gradient(to_bottom,transparent_0%,rgba(148,163,184,0.06)_40%,transparent_100%)]" style={{ backgroundSize: '100% 12px' }} />
                          </div>

                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Camera Selection</div>
                              <div className="space-y-2">
                                {cameraFeeds.map((camera) => (
                                  <button
                                    type="button"
                                    key={camera.id}
                                    onClick={() => setSelectedCameraId(camera.id)}
                                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                                      selectedCamera.id === camera.id
                                        ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100'
                                        : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
                                    }`}
                                  >
                                    <span>{camera.name}</span>
                                    <span className={`h-2.5 w-2.5 rounded-full ${camera.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' : 'bg-slate-500'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">System Feed</div>
                              <div className="space-y-3 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                                <div className="flex items-center justify-between"><span>Signal</span><span className="text-emerald-300">96%</span></div>
                                <div className="flex items-center justify-between"><span>Tracking</span><span className="text-cyan-300">Auto</span></div>
                                <div className="flex items-center justify-between"><span>Resolution</span><span>1080p</span></div>
                                <div className="flex items-center justify-between"><span>Latency</span><span>42 ms</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                case 'alerts':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.alerts = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Alerts</h2>
                          <button type="button" className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">View All</button>
                        </div>
                        <div className="space-y-3">
                          {alerts.map((alert) => (
                            <div key={alert.title} className={`flex items-center gap-3 rounded-xl border p-3 ${
                              alert.type === 'critical' ? 'border-red-400/25 bg-red-500/5' : alert.type === 'warning' ? 'border-amber-400/25 bg-amber-500/5' : 'border-emerald-400/25 bg-emerald-500/5'
                            }`}>
                              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${alert.type === 'critical' ? 'bg-red-500/10 text-red-300' : alert.type === 'warning' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                                {alert.type === 'critical' ? '!' : alert.type === 'warning' ? '!' : '✓'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[12px] font-semibold text-slate-100">{alert.title}</div>
                                <div className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-slate-400">{alert.location}</div>
                              </div>
                              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{alert.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                case 'rover':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.rover = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">MineGuard — AI powered mine safety & rescue rover</div>
                            <div className="mt-1 text-[8px] uppercase tracking-[0.22em] text-slate-400">Rugged, intelligent, life-saving</div>
                          </div>
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300">ONLINE</span>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
                          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                            <div className="rover-reference-scene rover-technical-scene">
                              <div className="rover-reference-frame">
                                <div className="rover-reference-antenna" />
                                <div className="rover-reference-top" />
                                <div className="rover-reference-camera" />
                                <div className="rover-reference-thermal" />
                                <div className="rover-reference-light rover-reference-light-left" />
                                <div className="rover-reference-light rover-reference-light-right" />
                                <div className="rover-reference-wheel rover-reference-wheel-left" />
                                <div className="rover-reference-wheel rover-reference-wheel-mid-left" />
                                <div className="rover-reference-wheel rover-reference-wheel-mid-right" />
                                <div className="rover-reference-wheel rover-reference-wheel-right" />
                              </div>

                              <div className="rover-reference-label rover-label-a">UHF / VHF Antenna</div>
                              <div className="rover-reference-label rover-label-b">Wi-Fi / Long Range Communication</div>
                              <div className="rover-reference-label rover-label-c">Pan-Tilt Camera Unit</div>
                              <div className="rover-reference-label rover-label-d">Thermal Camera</div>
                              <div className="rover-reference-label rover-label-e">Gas Sensor Module</div>
                              <div className="rover-reference-label rover-label-f">Front LED Lights</div>
                              <div className="rover-reference-label rover-label-g">Front Bumper</div>
                              <div className="rover-reference-label rover-label-h">Water Level Sensor</div>
                              <div className="rover-reference-label rover-label-i">Sonar / Ultrasonic Obstacle Detection</div>
                              <div className="rover-reference-label rover-label-j">Emergency Indicator Light</div>
                              <div className="rover-reference-label rover-label-k">Side LED Lights</div>
                              <div className="rover-reference-label rover-label-l">Wheel / Tracks</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-200">Design overview</div>
                              <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                                MineGuard is a teleoperated / semi-autonomous rover designed for underground coal mines of Jharkhand. It can operate in toxic gas, low visibility, uneven terrain and flood conditions. It carries multi-sensor payloads, AI-based hazard detection and survivor detection systems and streams live data to the surface control station.
                              </p>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                              {[
                                ['Gas sensors', 'CH4, CO, CO2, H2S, O2'],
                                ['Thermal camera', 'Front / tilt mounted'],
                                ['Navigation', 'LIDAR + sonar + Wi-Fi'],
                                ['Payload', 'AI detection & telemetry'],
                              ].map(([title, value]) => (
                                <div key={title} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
                                  <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">{title}</div>
                                  <div className="mt-1 text-[10px] font-semibold text-slate-100">{value}</div>
                                </div>
                              ))}
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-200">Key features</div>
                              <ul className="mt-2 space-y-1.5 text-[10px] leading-relaxed text-slate-300">
                                <li>• AI-based hazard detection with live visual alerts</li>
                                <li>• Survivor detection using thermal and night vision</li>
                                <li>• Rugged chassis for uneven, muddy and flooded tunnels</li>
                                <li>• Real-time communication link to control room</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                case 'reports':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.reports = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Reports</h2>
                          <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-200">1 Hour <ChevronDown size={11} /></button>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-[#06131f] p-3 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)]">
                          <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-slate-400">
                            <span>Environmental trend</span>
                            <span>Live telemetry</span>
                          </div>

                          <svg viewBox="0 0 420 190" className="h-[220px] w-full overflow-visible">
                            <defs>
                              <linearGradient id="chart-fill-temp" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="chart-fill-humidity" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="chart-fill-gas" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#34d399" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="chart-fill-air" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                              </linearGradient>
                            </defs>

                            {[0, 1, 2, 3, 4].map((row) => (
                              <line key={row} x1="26" x2="394" y1={20 + row * 38} y2={20 + row * 38} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
                            ))}

                            {trendSvg.map((series) => {
                              const linePoints = series.points;
                              const areaPoints = `${linePoints} 394,158 26,158`;

                              return (
                                <g key={series.label}>
                                  <polygon
                                    points={areaPoints}
                                    fill={`url(#chart-fill-${series.label.toLowerCase().replace(/\s+/g, '-')})`}
                                    opacity={0.9}
                                  />
                                  <polyline
                                    points={linePoints}
                                    fill="none"
                                    stroke={series.color}
                                    strokeWidth="2.4"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-400" /> Temperature</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-sky-400" /> Humidity</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> Gas</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet-400" /> Air</span>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                          {[
                            ['Temperature', '31.8°C', 'elevated'],
                            ['Humidity', '68%', 'normal'],
                            ['Gas level', '1.8% CH4', 'warning'],
                            ['Air quality', '82 / 100', 'stable'],
                          ].map(([label, value, tone]) => (
                            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
                              <div className="mt-2 text-[18px] font-bold text-slate-100">{value}</div>
                              <div className={`mt-1 text-[8px] uppercase tracking-[0.12em] ${tone === 'warning' ? 'text-amber-300' : tone === 'elevated' ? 'text-orange-300' : 'text-emerald-300'}`}>
                                {tone === 'warning' ? 'watch' : tone === 'elevated' ? 'high' : 'stable'}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-200">Report summary</div>
                          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300">
                            <p>Temperature remains elevated inside the active inspection tunnel, but within safe operational limits for short deployment windows.</p>
                            <p>Humidity is stable, with no major condensation buildup near the main route. Gas concentration is climbing slightly and should remain under active monitoring for the next cycle.</p>
                            <p>Air quality remains acceptable after filtration, and the rover is reporting consistent signal strength and route stability across the current sector.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                case 'settings':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.settings = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Settings</h2>
                          <div className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300">Config</div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Alert Threshold</div><div className="mt-2 text-lg font-semibold text-slate-100">High Risk</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Signal Strength</div><div className="mt-2 text-lg font-semibold text-slate-100">Strong</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Auto Sync</div><div className="mt-2 text-lg font-semibold text-slate-100">Enabled</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Rescue Mode</div><div className="mt-2 text-lg font-semibold text-slate-100">Standby</div></div>
                        </div>
                      </div>
                    </div>
                  );
                case 'user':
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current.user = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">User</h2>
                          <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-300">Operator</div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Operator ID</div><div className="mt-2 text-lg font-semibold text-slate-100">MINE-204</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Shift</div><div className="mt-2 text-lg font-semibold text-slate-100">Night Shift</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Access Level</div><div className="mt-2 text-lg font-semibold text-slate-100">Supervisor</div></div>
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Status</div><div className="mt-2 text-lg font-semibold text-slate-100">Online</div></div>
                        </div>
                      </div>
                    </div>
                  );
                default:
                  return (
                    <div className="space-y-4">
                      <div ref={(node) => { sectionRefs.current[activeSection] = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">{navItems.find((item) => item.section === activeSection)?.label}</h2>
                      </div>
                    </div>
                  );
              }
            })()}
          </div>

          <footer className="border-t border-slate-800 bg-slate-950/70 px-4 py-3">
            <div className="flex flex-col gap-2 text-center text-[10px] uppercase tracking-[0.14em] text-slate-300 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">⛏️</span>
                <span>AI-Powered System</span>
              </div>
              <div className="text-slate-400 md:text-center">Ensuring Miner Safety Through Intelligent Monitoring, Early Detection & Faster Rescue Operations</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <Dashboard />;
}
