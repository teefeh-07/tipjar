import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getStxAddress, authenticate, logout } from '../services/authService.js';
import { isConnected, connectWallet, disconnectWallet, getSession } from '../services/walletConnectService.js';

export default function useWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setConnected(true);
      setAddress(getStxAddress());
      setProvider('hiro');
    } else if (isConnected()) {
      setConnected(true);
      setProvider('walletconnect');
      const session = getSession();
      if (session) setAddress(session.namespaces?.stacks?.accounts?.[0]?.split(':')[2] || null);
    }
  }, []);

  const connect = useCallback(async (method = 'hiro') => {
    if (method === 'hiro') {
      authenticate();
    } else {
      await connectWallet();
      setConnected(true);
      setProvider('walletconnect');
    }
  }, []);

