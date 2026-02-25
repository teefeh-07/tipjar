import React, { useState, useEffect, useMemo } from 'react';
import { computeTipMetrics, computeFunnelMetrics } from '../services/analyticsService.js';
import { formatStx, truncateAddress } from '../utils/helpers.js';

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.floor(startValue + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return React.createElement('span', { className: 'animated-counter' },
    `${prefix}${displayValue.toLocaleString()}${suffix}`
  );
}

// SVG Mini chart component
function MiniChart({ data, width = 200, height = 60, color = '#7c3aed' }) {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data, 1);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  
  return React.createElement('svg', {
    width, height, viewBox: `0 0 ${width} ${height}`,
    className: 'mini-chart'
  },
    React.createElement('defs', null,
      React.createElement('linearGradient', { id: 'chartGradient', x1: '0', y1: '0', x2: '0', y2: '1' },
        React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: '0.4' }),
        React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: '0.05' })
      )
    ),
    React.createElement('polygon', { points: areaPoints, fill: 'url(#chartGradient)' }),
    React.createElement('polyline', {
      points, fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
    })
  );
}

// Hourly activity heatmap
function HourlyHeatmap({ data }) {
  const maxVal = Math.max(...data, 1);
  const hours = ['12a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a',
                  '12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p'];
  
  return React.createElement('div', { className: 'heatmap-container' },
    React.createElement('h4', null, 'Activity by Hour'),
    React.createElement('div', { className: 'heatmap-grid' },
      data.map((val, i) => {
        const intensity = val / maxVal;
        const bg = `rgba(124, 58, 237, ${intensity * 0.8 + 0.1})`;
        return React.createElement('div', {
          key: i,
          className: 'heatmap-cell',
          style: { backgroundColor: bg },
          title: `${hours[i]}: ${val} tips`
        }, hours[i]);
      })
    )
  );
}

// Conversion funnel visualization
function ConversionFunnel({ funnel, conversionRate }) {
  const maxCount = Math.max(...funnel.map(f => f.count), 1);
  
  return React.createElement('div', { className: 'funnel-container' },
    React.createElement('h4', null, 'Conversion Funnel'),
    React.createElement('div', { className: 'funnel-stages' },
      funnel.map((stage, i) => {
        const width = Math.max((stage.count / maxCount) * 100, 10);
        return React.createElement('div', { key: i, className: 'funnel-stage' },
          React.createElement('div', { className: 'funnel-label' }, stage.stage),
          React.createElement('div', { className: 'funnel-bar-track' },
            React.createElement('div', {
              className: 'funnel-bar-fill',
              style: { width: `${width}%` }
            })
          ),
          React.createElement('div', { className: 'funnel-count' }, stage.count)
        );
      })
    ),
    React.createElement('p', { className: 'conversion-rate' },
      `Overall conversion: ${conversionRate}%`
    )
  );
}

// Main Analytics Dashboard component
export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    setMetrics(computeTipMetrics());
    setFunnel(computeFunnelMetrics());
    const interval = setInterval(() => {
      setMetrics(computeTipMetrics());
      setFunnel(computeFunnelMetrics());
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  
  if (!metrics) {
    return React.createElement('div', { className: 'analytics-loading' }, 'Loading analytics...');
  }
  
  return React.createElement('div', { className: 'analytics-dashboard' },
    React.createElement('div', { className: 'analytics-header' },
      React.createElement('h2', null, '📊 Platform Analytics'),
      React.createElement('div', { className: 'analytics-tabs' },
        ['overview', 'trends', 'funnel'].map(tab =>
          React.createElement('button', {
            key: tab,
            className: `tab-btn ${activeTab === tab ? 'active' : ''}`,
            onClick: () => setActiveTab(tab)
          }, tab.charAt(0).toUpperCase() + tab.slice(1))
        )
      )
    ),
    React.createElement('div', { className: 'metrics-grid' },
      React.createElement('div', { className: 'metric-card glass' },
        React.createElement('p', { className: 'metric-label' }, 'Total Tips'),
        React.createElement(AnimatedCounter, { value: metrics.totalTips }),
        React.createElement(MiniChart, { data: metrics.hourlyDistribution })
      ),
      React.createElement('div', { className: 'metric-card glass' },
        React.createElement('p', { className: 'metric-label' }, 'Total Volume'),
        React.createElement(AnimatedCounter, { value: metrics.totalVolume, suffix: ' μSTX' })
      ),
      React.createElement('div', { className: 'metric-card glass' },
        React.createElement('p', { className: 'metric-label' }, 'Avg Tip'),
        React.createElement(AnimatedCounter, { value: Math.round(metrics.averageTip), suffix: ' μSTX' })
      ),
      React.createElement('div', { className: 'metric-card glass' },
        React.createElement('p', { className: 'metric-label' }, 'Unique Recipients'),
        React.createElement(AnimatedCounter, { value: metrics.uniqueRecipients })
      )
    ),
    activeTab === 'trends' && React.createElement(HourlyHeatmap, { data: metrics.hourlyDistribution }),
    activeTab === 'funnel' && funnel && React.createElement(ConversionFunnel, funnel)
  );
}
