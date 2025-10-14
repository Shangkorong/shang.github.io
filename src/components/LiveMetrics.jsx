import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';  // ADD THIS
import { portfolioData } from '../data/mock';

const LiveMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef();
  const dropdownRef = useRef();  // NEW: Track dropdown
  const timeoutRef = useRef();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }
  };

  const handleFocus = () => {
    clearTimeout(timeoutRef.current);
    setIsFocused(true);
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!containerRef.current?.matches(':hover')) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsVisible(!isVisible);
    }
    if (e.key === 'Escape') {
      setIsVisible(false);
      containerRef.current?.blur();
    }
  };

  const handleTouchStart = () => {
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  // FIXED: Click outside - check both button and dropdown
  useEffect(() => {
    if (isVisible) {
      const handleClickOutside = (e) => {
        if (
          containerRef.current && 
          !containerRef.current.contains(e.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        ) {
          setIsVisible(false);
        }
      };

      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isVisible]);

  const springConfig = {
    stiffness: 360,
    damping: 28,
    mass: 0.8,
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Button */}
      <div
        className="glass-panel-subtle p-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-highlight)] focus-visible:ring-opacity-60 rounded-lg transition-all duration-200"
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label="Show live verification metrics"
        aria-expanded={isVisible}
      >
        <div className="flex items-center justify-between">
          <span className="text-on-glass text-sm font-mono">Live Metrics</span>
          <motion.div
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--color-highlight)]"
          >
            ▼
          </motion.div>
        </div>
      </div>

      {/* PORTAL: Render dropdown outside Hero section */}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={springConfig}
              className="glass-panel-dropdown p-6 pointer-events-auto max-h-[60vh] overflow-y-auto"
              style={{
                position: 'fixed',
                top: containerRef.current 
                  ? `${containerRef.current.getBoundingClientRect().bottom + 12}px` 
                  : 'auto',
                left: containerRef.current 
                  ? `${containerRef.current.getBoundingClientRect().left}px` 
                  : 'auto',
                width: containerRef.current 
                  ? `${containerRef.current.offsetWidth}px` 
                  : 'auto',
                zIndex: 999999,
                minWidth: '280px',
              }}
            >
              {/* Enhanced Stats Display */}
              <div className="space-y-4">
                {portfolioData.heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springConfig, delay: index * 0.05 }}
                    className="flex justify-between items-center group relative"
                  >
                    <span 
                      className="text-sm font-medium tracking-wide" 
                      style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                      {stat.label}
                    </span>
                    
                    <motion.span
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ ...springConfig, delay: index * 0.05 + 0.1 }}
                      className="font-mono font-bold text-lg"
                      style={{ 
                        color: '#00FFD1',
                        textShadow: '0 0 10px rgba(0, 255, 209, 0.3)'
                      }}
                    >
                      {stat.value}
                    </motion.span>
                    
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0, 255, 209, 0.05), transparent)',
                        pointerEvents: 'none'
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 mb-3"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 255, 209, 0.6), transparent)',
                  boxShadow: '0 0 8px rgba(0, 255, 209, 0.3)'
                }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#00FFD1',
                    boxShadow: '0 0 10px rgba(0, 255, 209, 0.8), 0 0 20px rgba(0, 255, 209, 0.4)'
                  }}
                />
                <span className="font-mono font-medium">Real-time data</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body  // RENDER AT BODY LEVEL - ESCAPES HERO SECTION
      )}
    </div>
  );
};

export default LiveMetrics;
