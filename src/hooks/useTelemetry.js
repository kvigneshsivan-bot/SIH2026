import { useEffect, useState } from 'react';
import apiService from '../services/api';
import { createTelemetrySocket } from '../services/websocket';
import { DEFAULT_SYSTEM_STATUS, DEFAULT_ROVER_STATUS, DEFAULT_MISSION, EMPTY_SENSOR_VALUES, EMPTY_HISTORY, EMPTY_ALERTS, EMPTY_EVENTS } from '../config/thresholds';

const defaultStatus = {
  systemStatus: DEFAULT_SYSTEM_STATUS,
  roverStatus: DEFAULT_ROVER_STATUS,
  mission: DEFAULT_MISSION,
  sensorData: { data: EMPTY_SENSOR_VALUES, status: 'offline', timestamp: null },
  history: EMPTY_HISTORY,
  alerts: EMPTY_ALERTS,
  events: EMPTY_EVENTS,
  isLoading: true,
  isOffline: true,
  error: null
};

export function useTelemetry() {
  const [state, setState] = useState(defaultStatus);

  useEffect(() => {
    let isMounted = true;
    let socket = null;

    const loadData = async () => {
      try {
        const [latest, history, roverStatus, alerts, mission, events, systemStatus] = await Promise.all([
          apiService.getLatestSensors(),
          apiService.getSensorHistory(),
          apiService.getRoverStatus(),
          apiService.getAlerts(),
          apiService.getMission(),
          apiService.getEvents(),
          apiService.getSystemStatus()
        ]);

        if (!isMounted) return;

        setState({
          systemStatus: systemStatus || DEFAULT_SYSTEM_STATUS,
          roverStatus: roverStatus || DEFAULT_ROVER_STATUS,
          mission: mission || DEFAULT_MISSION,
          sensorData: latest || { data: EMPTY_SENSOR_VALUES, status: 'offline', timestamp: null },
          history: history || EMPTY_HISTORY,
          alerts: alerts || EMPTY_ALERTS,
          events: events || EMPTY_EVENTS,
          isLoading: false,
          isOffline: !latest || latest.status === 'offline',
          error: null
        });
      } catch (error) {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isOffline: true,
          error: error.message
        }));
      }
    };

    const wsUrl = import.meta.env.VITE_WS_URL;
    if (wsUrl) {
      socket = createTelemetrySocket({
        url: wsUrl,
        onMessage: (message) => {
          if (!message || typeof message !== 'object') return;
          setState((prev) => ({
            ...prev,
            sensorData: message.sensors || prev.sensorData,
            roverStatus: message.rover || prev.roverStatus,
            alerts: message.alerts || prev.alerts,
            mission: message.mission || prev.mission,
            events: message.events || prev.events,
            systemStatus: message.system || prev.systemStatus,
            isOffline: false,
            isLoading: false
          }));
        },
        onError: () => {
          setState((prev) => ({ ...prev, isOffline: true }));
        },
        onClose: () => {
          setState((prev) => ({ ...prev, isOffline: true }));
        }
      });
    }

    loadData();
    const poller = setInterval(loadData, 8000);

    return () => {
      isMounted = false;
      clearInterval(poller);
      if (socket && socket.close) socket.close();
    };
  }, []);

  return state;
}

export default useTelemetry;
