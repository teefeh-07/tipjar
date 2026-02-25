import React from 'react';
import { getTipHistory } from '../services/tipService.js';

export default function TipHistory() {
  const tips = getTipHistory();

  if (tips.length === 0) {
    return <div className="tip-history-empty"><p>No tips sent yet. Be the first to tip a creator!</p></div>;
  }

  return (
    <div className="tip-history">
      <h2>Tip History</h2>
      <ul className="tip-list">
        {tips.map(tip => (
          <li key={tip.id} className="tip-item">
            <div className="tip-recipient">To: {tip.recipient.slice(0, 8)}...{tip.recipient.slice(-4)}</div>
            <div className="tip-amount">{(tip.amount / 1000000).toFixed(6)} STX</div>
            {tip.memo && <div className="tip-memo">&quot;{tip.memo}&quot;</div>}
            <div className="tip-meta">
              <span className="tip-time">{new Date(tip.timestamp).toLocaleString()}</span>
              <span className={`tip-status tip-status--${tip.status}`}>{tip.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
