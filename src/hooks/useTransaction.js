import { useState, useCallback } from 'react';

import { API_URL } from '../config/network.js';

const TX_STATES = { IDLE: 'idle', PENDING: 'pending', CONFIRMED: 'confirmed', FAILED: 'failed' };

