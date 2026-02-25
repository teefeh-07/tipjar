import React, { useState } from 'react';
import { authenticate, logout, isAuthenticated, getStxAddress } from '../services/authService.js';
import { connectWallet, disconnectWallet, isConnected } from '../services/walletConnectService.js';

export default function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const connected = isAuthenticated() || isConnected();
  const address = getStxAddress();

