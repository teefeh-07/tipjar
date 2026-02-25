// WebSocket Service for Real-time Platform Updates
// Auto-reconnect, heartbeat, event channels, message queuing

// WebSocket configuration
const WS_URL = process.env.WS_URL || 'wss://tipjar.app/ws';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const MAX_RECONNECT_DELAY = 30000; // 30 seconds max
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_QUEUE_SIZE = 100;

// Connection state
let ws = null;
let isConnected = false;
let reconnectAttempts = 0;
let heartbeatTimer = null;
let reconnectTimer = null;
const messageQueue = [];
const subscriptions = new Map();
const eventListeners = new Map();

