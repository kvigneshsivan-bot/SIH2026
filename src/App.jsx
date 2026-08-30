import React, { useEffect, useMemo, useRef, useState } from 'react';
import roverVehicle from './assets/rover-vehicle.svg';
import {
  AlertTriangle,
  Bell,
  BatteryCharging,
  ChevronDown,
  Gauge,
  Map,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Wifi,
  Settings,
  Camera,
  User,
  FileText,
  Siren,
  MapPinned,
  Cpu,
  ChevronRight,
  Plus,
  Minus,
  Activity,
  BellRing,
  GaugeCircle,
  ClipboardList,
  LocateFixed,
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

function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mapZoom, setMapZoom] = useState(1);
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

  // Simulated live data: replace with real sensor/API/WebSocket values later.
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

  const alerts = [
    { type: 'critical', title: 'High Gas Concentration Detected', location: 'Zone B, Tunnel 2', time: '04:34 PM' },
    { type: 'warning', title: 'Humidity Above Threshold', location: 'Tunnel C, Zone 1', time: '04:32 PM' },
    { type: 'safe', title: 'Rover Reached Checkpoint 4', location: 'Tunnel A', time: '04:30 PM' },
  ];

  const trendSeries = [
    { label: 'Temperature', color: '#fbbf24', values: [38, 40, 39, 41, 46, 43, 44, 47, 48, 45, 46, 50] },
    { label: 'Humidity', color: '#60a5fa', values: [52, 55, 57, 58, 61, 63, 60, 62, 68, 66, 64, 65] },
    { label: 'Gas Level', color: '#34d399', values: [70, 82, 76, 80, 94, 102, 108, 110, 116, 120, 124, 118] },
    { label: 'Air Quality', color: '#a78bfa', values: [34, 36, 39, 42, 41, 44, 48, 46, 45, 43, 40, 42] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());

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
    }, 2800);

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

    return trendSeries
      .map((series) => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden border-x border-slate-800/80 bg-[#0b1220]">
        <aside className="hidden w-[220px] flex-col border-r border-slate-800 bg-[#0d1723] lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-lg text-cyan-300">
              ⛏️
            </div>
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
            <div className="flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
              <span className="text-cyan-300">OPERATIONS</span>
            </div>
          </header>

          <div className="dashboard-grid-pattern flex-1 overflow-y-auto px-4 py-4">
            {(() => {
              switch (activeSection) {
                case 'dashboard':
                  return (
                    <div className="space-y-4">
                      <section ref={(node) => { sectionRefs.current.dashboard = node; }} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
                              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] ${statusConfig[metric.statusTone]}`}>
                                {metric.status}
                              </span>
                            </div>

                            <div className="mb-2 flex items-end gap-1">
                              <span className="text-[22px] font-bold leading-none text-slate-50">{metric.value}</span>
                              {metric.unit && <span className="pb-1 text-[10px] uppercase text-slate-400">{metric.unit}</span>}
                            </div>

                            <div className="mb-3 text-[9px] uppercase tracking-[0.12em] text-slate-400">{metric.range}</div>

                            <svg viewBox="0 0 100 26" className="h-7 w-full overflow-visible">
                              <path
                                d={metric.trail.map((value, index) => {
                                  const x = (index / (metric.trail.length - 1)) * 100;
                                  const y = 22 - ((value - 10) / 60) * 18;
                                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke={
                                  metric.id === 'temperature'
                                    ? '#f59e0b'
                                    : metric.id === 'humidity'
                                      ? '#60a5fa'
                                      : metric.id === 'gas'
                                        ? '#facc15'
                                        : metric.id === 'air'
                                          ? '#34d399'
                                          : '#a78bfa'
                                }
                                strokeWidth="2.2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        ))}
                      </section>

                      <section ref={(node) => { sectionRefs.current.map = node; }} className="grid gap-4 xl:grid-cols-[1.7fr_1.15fr_1.15fr]">
                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Mine Map & Rover Location</h2>
                            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                              <button onClick={() => handleMapZoom('out')} className="flex h-6 w-6 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-200" type="button"><Minus size={12} /></button>
                              <span className="px-1 font-medium">{Math.round(mapZoom * 100)}%</span>
                              <button onClick={() => handleMapZoom('in')} className="flex h-6 w-6 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-200" type="button"><Plus size={12} /></button>
                            </div>
                          </div>

                          <div className="map-grid-pattern relative h-[270px] overflow-hidden rounded-xl border border-slate-800 bg-[#091318]">
                            <div
                              className="absolute inset-0 transition-transform duration-200 ease-out"
                              style={{
                                transform: `scale(${mapZoom})`,
                                transformOrigin: 'center center',
                              }}
                            >
                              <div className="absolute inset-0 opacity-60">
                                <div className="map-tunnel map-tunnel-a" />
                                <div className="map-tunnel map-tunnel-b" />
                                <div className="map-tunnel map-tunnel-c" />
                              </div>

                              <div className="map-base-station">
                                <span className="map-base-station-inner" />
                              </div>
                              <div className="map-tower map-tower-a" />
                              <div className="map-tower map-tower-b" />
                              <div className="map-tower map-tower-c" />

                              <div className="absolute left-4 top-6 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel A</div>
                              <div className="absolute left-[38%] top-[20%] text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel B</div>
                              <div className="absolute right-6 bottom-8 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel C</div>

                              <div className="hazard-ring absolute left-[52%] top-[40%]" />
                              <div className="absolute left-[56%] top-[48%] text-[10px] text-red-200">!</div>
                              <div className="absolute left-[18%] top-[60%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                              <div className="absolute left-[44%] top-[26%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                              <div className="absolute left-[64%] top-[50%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                              <div className="absolute left-[52%] top-[64%] h-3.5 w-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]" />
                              <div className="absolute left-[30%] top-[50%] h-4 w-4 rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.8)]" />

                              <div className="rover-animate absolute left-[49%] top-[46%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                                <img src={roverVehicle} alt="MineGuard rover on map" className="rover-spin h-12 w-20 object-contain drop-shadow-[0_0_24px_rgba(74,222,128,0.7)]" />
                              </div>
                              <div className="absolute left-[16%] top-[70%] h-4 w-4 rounded-full border border-slate-300 bg-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />

                              <div className="absolute bottom-4 left-4 flex gap-3 text-[9px] uppercase tracking-[0.14em] text-slate-300">
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Rover</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-400" /> Gas</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" /> Worker</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-300" /> Checkpoint</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div ref={(node) => { sectionRefs.current.camera = node; }} className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Live Camera Feed</h2>
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-red-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 data-pulse" /> LIVE
                            </div>
                          </div>

                          <div className="scanline relative h-[230px] overflow-hidden rounded-xl border border-slate-800">
                            <div className="camera-tunnel-scene">
                              <div className="camera-tunnel-ring camera-tunnel-ring-outer" />
                              <div className="camera-tunnel-ring camera-tunnel-ring-mid" />
                              <div className="camera-tunnel-ring camera-tunnel-ring-inner" />
                              <div className="camera-light-glow" />
                              <div className="camera-worker camera-worker-left" />
                              <div className="camera-worker camera-worker-right" />
                              <div className="camera-rock camera-rock-a" />
                              <div className="camera-rock camera-rock-b" />
                              <div className="camera-rock camera-rock-c" />
                            </div>
                            <div className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-200">ROVER CAMERA</div>
                          </div>
                        </div>

                        <div ref={(node) => { sectionRefs.current.human = node; }} className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Human Detection</h2>
                          </div>

                          <div className="mb-3 flex h-[118px] items-center justify-center rounded-xl border border-dashed border-red-400/50 bg-red-500/5">
                            <div className="flex flex-col items-center gap-2 text-red-300">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/60 bg-red-500/10 text-3xl">🧍</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                            <div className="flex items-center justify-between"><span>Status</span><span className="font-bold text-red-300">Person Detected</span></div>
                            <div className="flex items-center justify-between"><span>Location</span><span className="font-bold text-slate-100">Tunnel B – Zone 2</span></div>
                            <div className="flex items-center justify-between"><span>Confidence</span><span className="font-bold text-slate-100">94%</span></div>
                          </div>

                          <button type="button" className="mt-4 w-full rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-red-200">
                            Possible Trapped Worker
                          </button>
                        </div>
                      </section>

                      <section ref={(node) => { sectionRefs.current.alerts = node; }} className="grid gap-4 xl:grid-cols-[1fr]">
                        <div className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Alerts</h2>
                            <button type="button" className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">View All</button>
                          </div>

                          <div className="space-y-3">
                            {alerts.map((alert) => (
                              <div
                                key={alert.title}
                                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                                  alert.type === 'critical'
                                    ? 'border-red-400/30 bg-red-500/8 text-red-200 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.12)]'
                                    : alert.type === 'warning'
                                      ? 'border-amber-400/30 bg-amber-500/8 text-amber-200 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]'
                                      : 'border-emerald-400/30 bg-emerald-500/8 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.12)]'
                                }`}
                              >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-md text-base font-bold ${
                                  alert.type === 'critical'
                                    ? 'bg-red-500/10 text-red-300'
                                    : alert.type === 'warning'
                                      ? 'bg-amber-500/10 text-amber-300'
                                      : 'bg-emerald-500/10 text-emerald-300'
                                }`}>
                                  {alert.type === 'critical' ? '!' : alert.type === 'warning' ? '!' : '✓'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-[15px] font-semibold leading-tight text-slate-100">{alert.title}</div>
                                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">{alert.location}</div>
                                </div>
                                <div className="min-w-[82px] text-right text-[10px] uppercase tracking-[0.12em] text-slate-400">{alert.time}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div ref={(node) => { sectionRefs.current.rover = node; }} className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Rover Status</h2>
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300">ONLINE</span>
                          </div>

                          <div className="flex gap-3">
                            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                              <div className="rover-card-shell rover-animate">
                                <img src={roverVehicle} alt="MineGuard rover" className="rover-spin h-[120px] w-full object-contain drop-shadow-[0_0_18px_rgba(250,204,21,0.25)]" />
                              </div>
                            </div>

                            <div className="flex-1 space-y-2.5 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Battery</span><span className="font-bold text-slate-100">78%</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Speed</span><span className="font-bold text-slate-100">0.8 m/s</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Location</span><span className="font-bold text-slate-100">Tunnel B</span></div>
                              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-1.5"><span>Distance</span><span className="font-bold text-slate-100">245.6 m</span></div>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                            <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2">
                              <div className="text-slate-400">Connection</div>
                              <div className="mt-1 inline-flex items-center gap-1 font-bold text-slate-100"><Wifi size={11} /> Stable</div>
                            </div>
                            <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2">
                              <div className="text-slate-400">Last Update</div>
                              <div className="mt-1 font-bold text-slate-100">2 sec ago</div>
                            </div>
                          </div>
                        </div>

                        <div ref={(node) => { sectionRefs.current.reports = node; }} className="industrial-glow rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Environmental Trends</h2>
                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-200">
                              1 Hour <ChevronDown size={11} />
                            </button>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2">
                            <svg viewBox="0 0 380 170" className="h-[160px] w-full">
                              {trendSvg.map((series) => (
                                <polyline key={series.label} fill="none" stroke={series.color} strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round" points={series.points} />
                              ))}
                              {[0,1,2,3].map((row) => (
                                <line key={row} x1="18" x2="362" y1={22 + row*38} y2={22 + row*38} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
                              ))}
                            </svg>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-400" /> Temperature</span>
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-sky-400" /> Humidity</span>
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> Gas</span>
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet-400" /> Air</span>
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
                          <div className="absolute inset-0 opacity-40">
                            <div className="map-tunnel map-tunnel-a" />
                            <div className="map-tunnel map-tunnel-b" />
                            <div className="map-tunnel map-tunnel-c" />
                          </div>
                          <div className="absolute left-4 top-6 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel A</div>
                          <div className="absolute left-[38%] top-[20%] text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel B</div>
                          <div className="absolute right-6 bottom-8 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-300">Tunnel C</div>
                          <div className="hazard-ring absolute left-[52%] top-[40%]" />
                          <div className="absolute left-[56%] top-[48%] text-[10px] text-red-200">!</div>
                          <div className="absolute left-[18%] top-[60%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[44%] top-[26%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[64%] top-[50%] h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
                          <div className="absolute left-[52%] top-[64%] h-3.5 w-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]" />
                          <div className="absolute left-[30%] top-[50%] h-4 w-4 rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.8)]" />
                          <div className="rover-animate absolute left-[49%] top-[46%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                            <img src={roverVehicle} alt="MineGuard rover on map" className="rover-spin h-12 w-20 object-contain drop-shadow-[0_0_24px_rgba(74,222,128,0.7)]" />
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
                        <div className="scanline relative h-[420px] overflow-hidden rounded-xl border border-slate-800 bg-[radial-gradient(circle_at_center,_rgba(94,234,212,0.25),_rgba(15,23,42,0.8)_42%,_rgba(2,6,23,0.98)_100%)]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(148,163,184,0.12),_transparent_28%)]" />
                          <div className="absolute inset-x-6 bottom-5 h-20 rounded-[50%] bg-slate-900/70 blur-2xl" />
                          <div className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-200">ROVER CAMERA</div>
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
                      <div ref={(node) => { sectionRefs.current.rover = node; }} className="industrial-glow rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="mb-5 flex items-center justify-between">
                          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-200">Rover Status</h2>
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300">ONLINE</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
                          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="rover-card-shell rover-animate">
                              <img src={roverVehicle} alt="MineGuard rover" className="rover-spin h-[160px] w-full object-contain drop-shadow-[0_0_18px_rgba(250,204,21,0.25)]" />
                            </div>
                          </div>
                          <div className="space-y-3 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><span>Battery</span><span className="font-bold text-slate-100">78%</span></div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><span>Speed</span><span className="font-bold text-slate-100">0.8 m/s</span></div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><span>Location</span><span className="font-bold text-slate-100">Tunnel B</span></div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><span>Distance</span><span className="font-bold text-slate-100">245.6 m</span></div>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><div className="text-slate-400">Connection</div><div className="mt-1 inline-flex items-center gap-1 font-bold text-slate-100"><Wifi size={11} /> Stable</div></div>
                              <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><div className="text-slate-400">Last Update</div><div className="mt-1 font-bold text-slate-100">2 sec ago</div></div>
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
                        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2">
                          <svg viewBox="0 0 380 170" className="h-[220px] w-full">
                            {trendSvg.map((series) => (
                              <polyline key={series.label} fill="none" stroke={series.color} strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round" points={series.points} />
                            ))}
                            {[0,1,2,3].map((row) => (
                              <line key={row} x1="18" x2="362" y1={22 + row*38} y2={22 + row*38} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
                            ))}
                          </svg>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-400" /> Temperature</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-sky-400" /> Humidity</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> Gas</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet-400" /> Air</span>
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

              <div className="text-slate-400 md:text-center">
                Ensuring Miner Safety Through Intelligent Monitoring, Early Detection & Faster Rescue Operations
              </div>

            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ClockDisplay({ time, date }) {
  return (
    <>
      <span className="flex items-center gap-2 text-slate-100">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-cyan-300">
          <Activity size={11} />
        </span>
        {time}
      </span>
      <span className="text-slate-400">·</span>
      <span>{date}</span>
    </>
  );
}

export default function App() {
  return <Dashboard />;
}
