import React from 'react';
import ConnectWallet from './ConnectWallet.jsx';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="logo">Tipjar</h1>
        <span className="tagline">Decentralized Tipping on Stacks</span>
      </div>
      <nav className="header-nav">
        <a href="#dashboard" className="nav-link">Dashboard</a>
        <a href="#send-tip" className="nav-link">Send Tip</a>
        <a href="#history" className="nav-link">History</a>
        <a href="#leaderboard" className="nav-link">Leaderboard</a>
      </nav>
      <div className="header-actions">
        <ConnectWallet />
      </div>
    </header>
  );
}
