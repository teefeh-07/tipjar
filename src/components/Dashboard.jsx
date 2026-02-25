import React, { useState, useEffect } from 'react';
import { getTipStats } from '../services/tipService.js';
import { getPlatformStats } from '../services/stacksService.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTips: 0, totalAmount: 0, uniqueRecipients: 0, averageTip: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const localStats = getTipStats();
        setStats(localStats);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

