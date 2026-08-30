export const SENSOR_CONFIG = [
  { key: 'methane', label: 'Methane (CH4)', unit: '%', icon: '⚠️' },
  { key: 'carbonMonoxide', label: 'Carbon Monoxide (CO)', unit: 'ppm', icon: '☠️' },
  { key: 'carbonDioxide', label: 'Carbon Dioxide (CO2)', unit: 'ppm', icon: '💨' },
  { key: 'hydrogenSulfide', label: 'Hydrogen Sulfide (H2S)', unit: 'ppm', icon: '🦴' },
  { key: 'oxygen', label: 'Oxygen (O2)', unit: '%', icon: '💨' },
  { key: 'temperature', label: 'Temperature', unit: '°C', icon: '🌡️' },
  { key: 'humidity', label: 'Humidity', unit: '%', icon: '💧' },
  { key: 'pressure', label: 'Atmospheric Pressure', unit: 'kPa', icon: '📈' },
  { key: 'waterLevel', label: 'Water Level', unit: 'm', icon: '💦' },
  { key: 'airQuality', label: 'Air Quality', unit: 'AQI', icon: '🌫️' }
];

export const SENSOR_THRESHOLDS = {
  methane: { warning: null, critical: null },
  carbonMonoxide: { warning: null, critical: null },
  carbonDioxide: { warning: null, critical: null },
  hydrogenSulfide: { warning: null, critical: null },
  oxygen: { warning: null, critical: null },
  temperature: { warning: null, critical: null },
  humidity: { warning: null, critical: null },
  pressure: { warning: null, critical: null },
  waterLevel: { warning: null, critical: null },
  airQuality: { warning: null, critical: null }
};

export const EMPTY_SENSOR_VALUES = {
  methane: null,
  carbonMonoxide: null,
  carbonDioxide: null,
  hydrogenSulfide: null,
  oxygen: null,
  temperature: null,
  humidity: null,
  pressure: null,
  waterLevel: null,
  airQuality: null
};

export const EMPTY_ALERTS = [];
export const EMPTY_EVENTS = [];
export const EMPTY_HISTORY = [];

export const DEFAULT_SYSTEM_STATUS = {
  mineStatus: 'WAITING',
  connectionStatus: 'OFFLINE',
  roverStatus: 'STANDBY',
  activeAlerts: 0,
  batteryLevel: null,
  communicationStatus: 'OFFLINE'
};

export const DEFAULT_ROVER_STATUS = {
  batteryLevel: null,
  motorStatus: 'STANDBY',
  speed: null,
  currentLocation: 'WAITING FOR LOCATION',
  communicationSignal: 'OFFLINE',
  missionTime: '--',
  lastDataUpdate: '--',
  navigationMode: 'STANDBY'
};

export const DEFAULT_MISSION = {
  missionId: 'N/A',
  missionObjective: 'Awaiting mission configuration from backend.',
  roverLocation: 'WAITING FOR LOCATION',
  distanceTravelled: '--',
  missionDuration: '--',
  currentTask: 'Waiting for task assignment',
  rescueStatus: 'STANDBY'
};

export const DEFAULT_MAP = {
  tunnels: [],
  roverPosition: [0, 0],
  checkpoints: [],
  hazards: [],
  survivors: [],
  floodZones: [],
  safeZones: []
};

export const EMPTY_CAMERA_STREAM = {
  id: 1,
  name: 'Front Camera',
  status: 'OFFLINE',
  active: false,
  streamUrl: null,
  offlineMessage: 'CAMERA OFFLINE'
};
