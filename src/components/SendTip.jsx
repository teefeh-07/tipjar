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

