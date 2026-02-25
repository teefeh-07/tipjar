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

