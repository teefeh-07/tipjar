import React, { useState } from 'react';
import { authenticate, logout, isAuthenticated, getStxAddress } from '../services/authService.js';
import { connectWallet, disconnectWallet, isConnected } from '../services/walletConnectService.js';

export default function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const connected = isAuthenticated() || isConnected();
  const address = getStxAddress();

  const handleHiroConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      authenticate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWCConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectWallet();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (isAuthenticated()) logout();
    if (isConnected()) disconnectWallet();
  };

  if (connected) {
    return (
      <div className="wallet-connected">
        <span className="wallet-address">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}</span>
        <button onClick={handleDisconnect} className="btn-disconnect">Disconnect</button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleHiroConnect} disabled={loading} className="btn-hiro">Connect Hiro Wallet</button>
      <button onClick={handleWCConnect} disabled={loading} className="btn-wc">Connect via WalletConnect</button>
      {loading && <span className="loading-indicator">Connecting...</span>}
    </div>
  );
}
