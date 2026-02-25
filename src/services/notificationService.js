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

