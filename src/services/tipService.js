// Tip orchestration service
// Manages tipping flow, history, and analytics

import { sendTip as stacksSendTip, getTipAmount } from './stacksService.js';

const tipHistory = [];
const TIP_MIN = 1000; // 0.001 STX in micro-STX
const TIP_MAX = 100000000; // 100 STX

