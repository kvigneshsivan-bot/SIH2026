export const mockSystemStatus = {
  mineStatus: 'WAITING',
  connectionStatus: 'OFFLINE',
  roverStatus: 'STANDBY',
  activeAlerts: 0,
  batteryLevel: null,
  communicationStatus: 'OFFLINE'
};

export const mockSensorData = {
  temperature: null,
  humidity: null,
  methane: null,
  carbonMonoxide: null,
  carbonDioxide: null,
  hydrogenSulfide: null,
  oxygen: null,
  airQuality: null,
  waterLevel: null,
  pressure: null
};

export const mockMineMap = {
  tunnels: [],
  roverPosition: [0, 0],
  checkpoints: [],
  hazards: [],
  survivors: [],
  floodZones: [],
  safeZones: []
};

export const mockPersonnelData = [];

export const mockCameraFeeds = [
  { id: 1, name: 'Front Camera', active: false, status: 'OFFLINE', streamUrl: null },
  { id: 2, name: '360° Pan-Tilt', active: false, status: 'OFFLINE', streamUrl: null },
  { id: 3, name: 'Thermal Camera', active: false, status: 'OFFLINE', streamUrl: null },
  { id: 4, name: 'Night Vision', active: false, status: 'OFFLINE', streamUrl: null }
];

export const mockAIDetection = {
  survivorDetected: null,
  detectionConfidence: null,
  detectedLocation: 'WAITING FOR DETECTION DATA',
  thermalDetectionStatus: 'OFFLINE',
  visualDetectionStatus: 'OFFLINE',
  audioDetectionStatus: 'OFFLINE',
  lastDetectionTime: '--'
};

export const mockHazards = [];

export const mockRoverStatus = {
  batteryLevel: null,
  motorStatus: 'STANDBY',
  speed: null,
  currentLocation: 'WAITING FOR LOCATION',
  communicationSignal: 'OFFLINE',
  missionTime: '--',
  lastDataUpdate: '--',
  navigationMode: 'STANDBY'
};

export const mockEnvironmentalTrends = {
  temperatureTrend: [],
  humidityTrend: [],
  methaneTrend: [],
  carbonMonoxideTrend: [],
  carbonDioxideTrend: [],
  waterLevelTrend: []
};

export const mockEventLog = [];

export const mockMissionPanel = {
  missionId: 'N/A',
  missionObjective: 'Awaiting mission configuration from backend.',
  roverLocation: 'WAITING FOR LOCATION',
  distanceTravelled: '--',
  missionDuration: '--',
  currentTask: 'Waiting for task assignment',
  rescueStatus: 'STANDBY'
};

export const mockLidarData = {
  status: 'OFFLINE',
  pointCount: 0,
  scanQuality: 'N/A',
  depthRange: '--',
  detectionAccuracy: '--'
};

export default {
  mockSystemStatus,
  mockSensorData,
  mockMineMap,
  mockPersonnelData,
  mockCameraFeeds,
  mockAIDetection,
  mockHazards,
  mockRoverStatus,
  mockEnvironmentalTrends,
  mockEventLog,
  mockMissionPanel,
  mockLidarData
};
