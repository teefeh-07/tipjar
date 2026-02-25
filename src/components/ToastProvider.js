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

