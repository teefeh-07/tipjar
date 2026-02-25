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

// Subscribe to event channel
export function subscribe(channel, handler) {
  if (!subscriptions.has(channel)) {
    subscriptions.set(channel, new Set());
  }
  subscriptions.get(channel).add(handler);
  
  // Tell server about subscription
  send('subscribe', { channel });
  
  // Return unsubscribe function
  return () => {
    const handlers = subscriptions.get(channel);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        subscriptions.delete(channel);
        send('unsubscribe', { channel });
      }
    }
  };
}

// Resubscribe to all channels after reconnect
function resubscribe() {
  for (const channel of subscriptions.keys()) {
    send('subscribe', { channel });
  }
}

// Heartbeat mechanism
function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (isConnected) send('ping');
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

// Reconnection with exponential backoff and jitter
function scheduleReconnect() {
  if (reconnectTimer) return;
  
  const delay = Math.min(
    INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts),
    MAX_RECONNECT_DELAY
  );
  const jitter = delay * (0.5 + Math.random() * 0.5);
  
  console.log(`Reconnecting in ${Math.round(jitter)}ms (attempt ${reconnectAttempts + 1})`);
  
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    reconnectAttempts++;
    connect();
  }, jitter);
}

// Replay queued messages after reconnect
function replayQueue() {
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

// Event emitter for internal listeners
function emit(event, data) {
  const listeners = eventListeners.get(event);
  if (listeners) {
    listeners.forEach(fn => fn(data));
  }
}

// Add event listener
export function on(event, handler) {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event).add(handler);
}

// Remove event listener
export function off(event, handler) {
  const listeners = eventListeners.get(event);
  if (listeners) listeners.delete(handler);
}

// Disconnect
export function disconnect() {
  stopHeartbeat();
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (ws) ws.close(1000, 'Client disconnect');
  isConnected = false;
}

// Get connection status
export function getConnectionStatus() {
  return { isConnected, reconnectAttempts, queueSize: messageQueue.length };
}
