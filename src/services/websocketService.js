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

// Connect to WebSocket server
export function connect(userAddress = null) {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  
  const url = userAddress ? `${WS_URL}?address=${userAddress}` : WS_URL;
  ws = new WebSocket(url);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    isConnected = true;
    reconnectAttempts = 0;
    startHeartbeat();
    replayQueue();
    resubscribe();
    emit('connection', { status: 'connected' });
  };
  
  ws.onclose = (event) => {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    isConnected = false;
    stopHeartbeat();
    emit('connection', { status: 'disconnected', code: event.code });
    scheduleReconnect();
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    emit('error', { error });
  };
  
  ws.onmessage = (event) => {
    handleMessage(event.data);
  };
}

