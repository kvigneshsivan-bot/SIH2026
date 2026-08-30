import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/EnvironmentalCharts.css';

export default function EnvironmentalCharts({ trends }) {
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  const metrics = {
    temperature: {
      label: 'Temperature vs Time',
      data: trends.temperatureTrend,
      dataKey: 'value',
      color: '#ff6b6b',
      unit: '°C'
    },
    humidity: {
      label: 'Humidity vs Time',
      data: trends.humidityTrend,
      dataKey: 'value',
      color: '#4a9eff',
      unit: '%'
    },
    methane: {
      label: 'Methane (CH4) vs Time',
      data: trends.methaneTrend,
      dataKey: 'value',
      color: '#ffaa00',
      unit: '%'
    },
    carbonMonoxide: {
      label: 'Carbon Monoxide (CO) vs Time',
      data: trends.carbonMonoxideTrend,
      dataKey: 'value',
      color: '#ff3333',
      unit: 'ppm'
    },
    carbonDioxide: {
      label: 'Carbon Dioxide (CO2) vs Time',
      data: trends.carbonDioxideTrend,
      dataKey: 'value',
      color: '#888888',
      unit: 'ppm'
    },
    waterLevel: {
      label: 'Water Level vs Time',
      data: trends.waterLevelTrend,
      dataKey: 'value',
      color: '#00aaff',
      unit: 'm'
    }
  };

  const currentMetric = metrics[selectedMetric];

  return (
    <div className="environmental-charts-container">
      <div className="charts-header">
        <h2>Environmental Monitoring Trends</h2>
        <span className="demo-badge">SIMULATED DATA</span>
      </div>

      <div className="charts-layout">
        <div className="metric-selector">
          <h3>Select Metric</h3>
          <div className="metric-buttons">
            {Object.entries(metrics).map(([key, metric]) => (
              <button
                key={key}
                className={`metric-btn ${selectedMetric === key ? 'active' : ''}`}
                onClick={() => setSelectedMetric(key)}
                title={metric.label}
              >
                {metric.label.split(' vs ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-display">
          <div className="chart-title">
            <h3>{currentMetric.label}</h3>
            <span className="chart-unit">(Unit: {currentMetric.unit})</span>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={currentMetric.data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="time"
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: `2px solid ${currentMetric.color}`,
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey={currentMetric.dataKey}
                stroke={currentMetric.color}
                dot={{ fill: currentMetric.color, r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-statistics">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Current Value:</span>
            <span className="stat-value">
              {currentMetric.data[currentMetric.data.length - 1]?.value?.toFixed(1) || 'N/A'} {currentMetric.unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Maximum:</span>
            <span className="stat-value">
              {Math.max(...currentMetric.data.map(d => d.value)).toFixed(1)} {currentMetric.unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Minimum:</span>
            <span className="stat-value">
              {Math.min(...currentMetric.data.map(d => d.value)).toFixed(1)} {currentMetric.unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average:</span>
            <span className="stat-value">
              {(currentMetric.data.reduce((a, b) => a + b.value, 0) / currentMetric.data.length).toFixed(1)} {currentMetric.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <h3>Thresholds & Safe Ranges</h3>
        <div className="threshold-grid">
          <div className="threshold-item">
            <span className="threshold-name">Temperature</span>
            <span className="threshold-range">Safe: 20-40°C</span>
          </div>
          <div className="threshold-item">
            <span className="threshold-name">Humidity</span>
            <span className="threshold-range">Safe: 30-70%</span>
          </div>
          <div className="threshold-item">
            <span className="threshold-name">Methane (CH4)</span>
            <span className="threshold-range">Safe: &lt; 1.25%</span>
          </div>
          <div className="threshold-item">
            <span className="threshold-name">Carbon Monoxide</span>
            <span className="threshold-range">Safe: &lt; 50 ppm</span>
          </div>
          <div className="threshold-item">
            <span className="threshold-name">Water Level</span>
            <span className="threshold-range">Safe: &lt; 2.5m</span>
          </div>
        </div>
      </div>

      <div className="chart-disclaimer">
        <strong>⚠️ Note:</strong> This chart displays simulated environmental data trends. 
        All data points are for demonstration purposes only.
      </div>
    </div>
  );
}
