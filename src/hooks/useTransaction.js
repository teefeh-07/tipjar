import { useState, useCallback } from 'react';

import { API_URL } from '../config/network.js';

const TX_STATES = { IDLE: 'idle', PENDING: 'pending', CONFIRMED: 'confirmed', FAILED: 'failed' };

export default function useTransaction() {
  const [txId, setTxId] = useState(null);
  const [status, setStatus] = useState(TX_STATES.IDLE);
  const [error, setError] = useState(null);

  const submit = useCallback(async (txFn) => {
    setStatus(TX_STATES.PENDING);
    setError(null);
    try {
      const result = await txFn();
      setTxId(result?.txId || null);
      setStatus(TX_STATES.CONFIRMED);
      return result;
    } catch (err) {
      setError(err.message);
      setStatus(TX_STATES.FAILED);
      throw err;
    }
  }, []);

