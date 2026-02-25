import React from 'react';
import { getTipHistory } from '../services/tipService.js';

export default function TipHistory() {
  const tips = getTipHistory();

  if (tips.length === 0) {
    return <div className="tip-history-empty"><p>No tips sent yet. Be the first to tip a creator!</p></div>;
  }

