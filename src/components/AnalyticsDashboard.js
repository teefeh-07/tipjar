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

