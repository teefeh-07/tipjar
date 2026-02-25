import React, { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './components/Dashboard.jsx';
import SendTip from './components/SendTip.jsx';
import TipHistory from './components/TipHistory.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import { initWalletConnect } from './services/walletConnectService.js';
import { initChainhooks } from './services/chainhooksService.js';

export default function App() {
  useEffect(() => {
    async function bootstrap() {
      try {
        await initWalletConnect();
        await initChainhooks();
        console.log('Services initialized');
      } catch (err) {
        console.error('Bootstrap error:', err);
      }
    }
    bootstrap();
  }, []);

