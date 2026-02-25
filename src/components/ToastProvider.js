import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Toast context
const ToastContext = createContext(null);

// Hook for consuming toast notifications
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

// Toast type configurations
const TOAST_TYPES = {
  success: { icon: '✅', className: 'toast-success', defaultMessage: 'Operation completed successfully' },
  error: { icon: '❌', className: 'toast-error', defaultMessage: 'An error occurred' },
  warning: { icon: '⚠️', className: 'toast-warning', defaultMessage: 'Warning' },
  info: { icon: 'ℹ️', className: 'toast-info', defaultMessage: 'Information' },
};

// Individual Toast component
function Toast({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(toast.duration || 5000);
  const startTimeRef = useRef(Date.now());
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  
  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);
  
  useEffect(() => {
    if (isPaused) {
      clearTimeout(timerRef.current);
      remainingRef.current -= Date.now() - startTimeRef.current;
      return;
    }
    
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(dismiss, remainingRef.current);
    return () => clearTimeout(timerRef.current);
  }, [isPaused, dismiss]);
  
  return React.createElement('div', {
    className: `toast ${config.className} ${isExiting ? 'toast-exit' : 'toast-enter'}`,
    role: 'alert',
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false)
  },
    React.createElement('div', { className: 'toast-icon' }, config.icon),
    React.createElement('div', { className: 'toast-body' },
      toast.title && React.createElement('div', { className: 'toast-title' }, toast.title),
      React.createElement('div', { className: 'toast-message' }, toast.message)
    ),
    toast.action && React.createElement('button', {
      className: 'toast-action',
      onClick: toast.action.onClick
    }, toast.action.label),
    React.createElement('button', {
      className: 'toast-close',
      onClick: dismiss,
      'aria-label': 'Dismiss'
    }, '×'),
    React.createElement('div', {
      className: 'toast-progress',
      style: {
        animationDuration: `${toast.duration || 5000}ms`,
        animationPlayState: isPaused ? 'paused' : 'running'
      }
    })
  );
}

// Toast Provider component
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);
  
  const showToast = useCallback((options) => {
    const id = ++idCounter.current;
    const toast = {
      id,
      type: options.type || 'info',
      title: options.title || null,
      message: options.message || TOAST_TYPES[options.type]?.defaultMessage || '',
      duration: options.duration || 5000,
      action: options.action || null,
    };
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);
  
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  // Convenience methods
  const toast = {
    success: (message, options = {}) => showToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => showToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => showToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => showToast({ ...options, type: 'info', message }),
    custom: showToast,
  };
  
  return React.createElement(ToastContext.Provider, { value: toast },
    children,
    React.createElement('div', {
      className: 'toast-container',
      role: 'region',
      'aria-label': 'Notifications',
      'aria-live': 'polite'
    },
      toasts.map(t =>
        React.createElement(Toast, {
          key: t.id,
          toast: t,
          onDismiss: dismissToast
        })
      )
    )
  );
}
