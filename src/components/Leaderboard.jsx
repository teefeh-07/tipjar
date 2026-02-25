import React from 'react';
import { getTopRecipients } from '../services/tipService.js';

export default function Leaderboard() {
  const topRecipients = getTopRecipients(10);
  const maxAmount = topRecipients.length > 0 ? topRecipients[0].total : 1;

  if (topRecipients.length === 0) {
    return <div className="leaderboard-empty"><p>No tips recorded yet. Start tipping to see the leaderboard!</p></div>;
  }

  return (
    <div className="leaderboard">
      <h2>Top Creators</h2>
      <ol className="leaderboard-list">
        {topRecipients.map((entry, index) => (
          <li key={entry.address} className="leaderboard-item">
            <span className="rank">#{index + 1}</span>
            <span className="address">{entry.address.slice(0, 8)}...{entry.address.slice(-4)}</span>
            <div className="bar-container"><div className="bar-fill" style={{ width: `${(entry.total / maxAmount) * 100}%` }}></div></div>
            <span className="total">{(entry.total / 1000000).toFixed(2)} STX</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
