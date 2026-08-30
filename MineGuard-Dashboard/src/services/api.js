import { EMPTY_SENSOR_VALUES, EMPTY_HISTORY, EMPTY_ALERTS, DEFAULT_SYSTEM_STATUS, DEFAULT_ROVER_STATUS, DEFAULT_MISSION, EMPTY_EVENTS } from '../config/thresholds';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const normalizeResponse = (payload, fallback) => {
  if (!payload || typeof payload !== 'object') return fallback;
  return payload;
};

const endpoint = (path) => `${API_BASE_URL}${path}`;

const request = async (path, options = {}) => {
  const response = await fetch(endpoint(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const apiService = {
  async getLatestSensors() {
    try {
      if (!API_BASE_URL) {
        return { data: EMPTY_SENSOR_VALUES, status: 'offline', timestamp: null };
      }

      const payload = await request('/api/sensors/latest');
      return normalizeResponse(payload, { data: EMPTY_SENSOR_VALUES, status: 'offline', timestamp: null });
    } catch (error) {
      console.warn('Sensor API unavailable:', error.message);
      return { data: EMPTY_SENSOR_VALUES, status: 'offline', timestamp: null };
    }
  },

  async getSensorHistory() {
    try {
      if (!API_BASE_URL) {
        return EMPTY_HISTORY;
      }

      const payload = await request('/api/sensors/history');
      return normalizeResponse(payload, EMPTY_HISTORY);
    } catch (error) {
      console.warn('Sensor history not available:', error.message);
      return EMPTY_HISTORY;
    }
  },

  async getRoverStatus() {
    try {
      if (!API_BASE_URL) {
        return DEFAULT_ROVER_STATUS;
      }

      const payload = await request('/api/rover/status');
      return normalizeResponse(payload, DEFAULT_ROVER_STATUS);
    } catch (error) {
      console.warn('Rover status not available:', error.message);
      return DEFAULT_ROVER_STATUS;
    }
  },

  async getRoverLocation() {
    try {
      if (!API_BASE_URL) {
        return { latitude: null, longitude: null, location: 'WAITING FOR LOCATION' };
      }

      const payload = await request('/api/rover/location');
      return normalizeResponse(payload, { latitude: null, longitude: null, location: 'WAITING FOR LOCATION' });
    } catch (error) {
      console.warn('Location API unavailable:', error.message);
      return { latitude: null, longitude: null, location: 'WAITING FOR LOCATION' };
    }
  },

  async getAlerts() {
    try {
      if (!API_BASE_URL) {
        return EMPTY_ALERTS;
      }

      const payload = await request('/api/alerts');
      return normalizeResponse(payload, EMPTY_ALERTS);
    } catch (error) {
      console.warn('Alerts API unavailable:', error.message);
      return EMPTY_ALERTS;
    }
  },

  async getMission() {
    try {
      if (!API_BASE_URL) {
        return DEFAULT_MISSION;
      }

      const payload = await request('/api/mission');
      return normalizeResponse(payload, DEFAULT_MISSION);
    } catch (error) {
      console.warn('Mission API unavailable:', error.message);
      return DEFAULT_MISSION;
    }
  },

  async getSystemStatus() {
    try {
      if (!API_BASE_URL) {
        return DEFAULT_SYSTEM_STATUS;
      }

      const payload = await request('/api/system/status');
      return normalizeResponse(payload, DEFAULT_SYSTEM_STATUS);
    } catch (error) {
      console.warn('System status unavailable:', error.message);
      return DEFAULT_SYSTEM_STATUS;
    }
  },

  async getEvents() {
    try {
      if (!API_BASE_URL) {
        return EMPTY_EVENTS;
      }

      const payload = await request('/api/events');
      return normalizeResponse(payload, EMPTY_EVENTS);
    } catch (error) {
      console.warn('Events API unavailable:', error.message);
      return EMPTY_EVENTS;
    }
  },

  async postRoverCommand(command) {
    try {
      if (!API_BASE_URL) {
        return { ok: false, message: 'Backend not connected' };
      }

      const payload = await request('/api/rover/command', {
        method: 'POST',
        body: JSON.stringify(command)
      });

      return payload;
    } catch (error) {
      console.warn('Command dispatch failed:', error.message);
      return { ok: false, message: 'Command dispatch failed' };
    }
  }
};

export default apiService;
