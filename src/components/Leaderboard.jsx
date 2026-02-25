import React from 'react';
import { getTopRecipients } from '../services/tipService.js';

export default function Leaderboard() {
  const topRecipients = getTopRecipients(10);
  const maxAmount = topRecipients.length > 0 ? topRecipients[0].total : 1;

