import React, { useState } from 'react';
import { authenticate, logout, isAuthenticated, getStxAddress } from '../services/authService.js';
import { connectWallet, disconnectWallet, isConnected } from '../services/walletConnectService.js';

