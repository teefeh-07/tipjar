import React from 'react';
import { getTopRecipients } from '../services/tipService.js';

export default function Leaderboard() {
  const topRecipients = getTopRecipients(10);
  const maxAmount = topRecipients.length > 0 ? topRecipients[0].total : 1;

  if (topRecipients.length === 0) {
    return <div className="leaderboard-empty"><p>No tips recorded yet. Start tipping to see the leaderboard!</p></div>;
  }

