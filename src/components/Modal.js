import React, { useEffect, useRef, useCallback } from 'react';

// Focus trap utility
function useFocusTrap(ref, isOpen) {
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }
    
    ref.current.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();
    
    return () => {
      ref.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
}

// Scroll lock utility
function useScrollLock(isOpen) {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
}

// Size class mapping
const SIZE_CLASSES = {
  sm: 'modal-sm',
  md: 'modal-md',
  lg: 'modal-lg',
  xl: 'modal-xl',
  fullscreen: 'modal-fullscreen',
};

// Main Modal component
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
}) {
  const modalRef = useRef(null);
  
  useFocusTrap(modalRef, isOpen);
  useScrollLock(isOpen);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  if (!isOpen) return null;
  
  return React.createElement('div', {
    className: 'modal-overlay',
    onClick: closeOnBackdrop ? onClose : undefined
  },
    React.createElement('div', {
      ref: modalRef,
      className: `modal-container ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`,
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': 'modal-title',
      onClick: (e) => e.stopPropagation()
    },
      // Header
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', { id: 'modal-title' }, title),
        showCloseButton && React.createElement('button', {
          className: 'modal-close',
          onClick: onClose,
          'aria-label': 'Close modal'
        }, '×')
      ),
      // Body
      React.createElement('div', { className: 'modal-body' }, children),
      // Footer
      footer && React.createElement('div', { className: 'modal-footer' }, footer)
    )
  );
}
