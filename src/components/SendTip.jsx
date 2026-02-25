import React, { useState } from 'react';
import { processTip, validateTip } from '../services/tipService.js';

const AMOUNT_PRESETS = [
  { label: '0.1 STX', value: 100000 },
  { label: '0.5 STX', value: 500000 },
  { label: '1 STX', value: 1000000 },
  { label: '5 STX', value: 5000000 },
];

export default function SendTip() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      const amountMicro = Math.floor(parseFloat(amount) * 1000000);
      const result = await processTip(recipient, amountMicro, memo);
      setStatus(`Tip sent! TX: ${result.txId}`);
      setRecipient('');
      setAmount('');
      setMemo('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (value) => {
    setAmount((value / 1000000).toString());
  };

