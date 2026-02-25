// Notification service
// Observable toast notification system

const listeners = [];
const notificationQueue = [];
const MAX_QUEUE_SIZE = 50;

export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notify(notification) {
  notificationQueue.push(notification);
  if (notificationQueue.length > MAX_QUEUE_SIZE) notificationQueue.shift();
  listeners.forEach(cb => cb(notification));
}

export function tipSent(recipient, amount) {
  notify({ type: 'success', title: 'Tip Sent!', message: `You sent ${amount / 1000000} STX to ${recipient.slice(0, 8)}...`, timestamp: Date.now() });
}

