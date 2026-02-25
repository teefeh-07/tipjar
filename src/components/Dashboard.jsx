import React, { useState, useEffect } from 'react';
import { getTipStats } from '../services/tipService.js';
import { getPlatformStats } from '../services/stacksService.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTips: 0, totalAmount: 0, uniqueRecipients: 0, averageTip: 0 });
  const [loading, setLoading] = useState(true);

