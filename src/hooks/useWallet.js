import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getStxAddress, authenticate, logout } from '../services/authService.js';
import { isConnected, connectWallet, disconnectWallet, getSession } from '../services/walletConnectService.js';

