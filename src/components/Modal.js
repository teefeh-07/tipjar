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

