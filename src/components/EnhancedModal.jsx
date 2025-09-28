import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const EnhancedModal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  closeOnBackdrop = true,
  closeOnEscape = true 
}) => {
  const modalRef = useRef();
  const previousFocusRef = useRef();
  const firstFocusableRef = useRef();
  const lastFocusableRef = useRef();

  // Focus trap setup
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Set focus to the modal
      const timer = setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      // Close on Escape
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap - Tab navigation
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey) {
            // Shift + Tab - move backwards
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab - move forwards
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const backdropVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(4px)'
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(8px)',
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      backdropFilter: 'blur(4px)',
      transition: {
        duration: 0.18,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.985,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1.0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        duration: 0.22
      }
    },
    exit: {
      opacity: 0,
      scale: 0.985,
      y: 20,
      transition: {
        duration: 0.18,
        ease: "easeIn"
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto focus:outline-none ${className}`}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal
  return createPortal(modalContent, document.body);
};

export default EnhancedModal;