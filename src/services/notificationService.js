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

export function tipReceived(sender, amount) {
  notify({ type: 'info', title: 'Tip Received!', message: `${sender.slice(0, 8)}... sent you ${amount / 1000000} STX`, timestamp: Date.now() });
}

export function transactionConfirmed(txId) {
  notify({ type: 'success', title: 'Transaction Confirmed', message: `TX ${txId.slice(0, 10)}... confirmed on-chain`, timestamp: Date.now() });
}

export function errorOccurred(message) {
  notify({ type: 'error', title: 'Error', message, timestamp: Date.now() });
}

export function getNotificationHistory() {
  return [...notificationQueue];
}
