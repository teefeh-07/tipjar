import { useState, useEffect } from 'react';
import { getTipHistory } from '../services/tipService.js';

export default function useTipHistory(refreshInterval = 10000) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

