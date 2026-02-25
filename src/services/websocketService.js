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

// Handle incoming messages
function handleMessage(rawData) {
  try {
    const message = JSON.parse(rawData);
    
    if (message.type === 'pong') return; // Heartbeat response
    
    // Route to channel subscribers
    if (message.channel && subscriptions.has(message.channel)) {
      const handlers = subscriptions.get(message.channel);
      handlers.forEach(handler => handler(message.data));
    }
    
    // Emit to general listeners
    emit(message.type || 'message', message.data);
  } catch (err) {
    console.warn('Failed to parse WebSocket message:', err);
  }
}

// Send message (or queue if disconnected)
export function send(type, data = {}, channel = null) {
  const message = JSON.stringify({ type, data, channel, timestamp: Date.now() });
  
  if (isConnected && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    if (messageQueue.length < MAX_QUEUE_SIZE) {
      messageQueue.push(message);
    }
  }
}

