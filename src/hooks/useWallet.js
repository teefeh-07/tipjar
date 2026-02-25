import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getStxAddress, authenticate, logout } from '../services/authService.js';
