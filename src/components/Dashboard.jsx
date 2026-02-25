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

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.totalTips}</h3><p>Total Tips</p></div>
        <div className="stat-card"><h3>{(stats.totalAmount / 1000000).toFixed(2)} STX</h3><p>Total Volume</p></div>
        <div className="stat-card"><h3>{stats.uniqueRecipients}</h3><p>Creators Tipped</p></div>
        <div className="stat-card"><h3>{(stats.averageTip / 1000000).toFixed(4)} STX</h3><p>Avg Tip</p></div>
      </div>
    </div>
  );
}
