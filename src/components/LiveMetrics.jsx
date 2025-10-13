import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/mock';

const LiveMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef();
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

  // Mobile touch handling
  const handleTouchStart = () => {
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  // Add click outside listener for mobile
  useEffect(() => {
    if (isVisible) {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
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
    mass: 0.8
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Hover/Focus trigger area */}
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

      {/* Metrics panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={springConfig}
            className="fixed md:absolute glass-panel p-4 z-[9999] pointer-events-auto max-h-[60vh] overflow-y-auto"
            style={{
              top: containerRef.current 
                ? `${containerRef.current.getBoundingClientRect().bottom + 8}px` 
                : 'auto',
              left: containerRef.current
                ? `${containerRef.current.getBoundingClientRect().left}px`
                : 'auto',
              width: containerRef.current
                ? `${containerRef.current.offsetWidth}px` 
                : 'auto',
              pointerEvents: isVisible ? 'auto' : 'none'
            }}
          >
            <div className="space-y-3">
              {portfolioData.heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...springConfig,
                    delay: index * 0.05
                  }}
                  className="flex justify-between items-center group"
                >
                  <span className="text-glass-secondary text-sm group-hover:text-on-glass transition-colors duration-200">
                    {stat.label}
                  </span>
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      ...springConfig,
                      delay: index * 0.05 + 0.1
                    }}
                    className="text-[var(--color-highlight)] font-mono font-bold text-lg"
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Enhanced visual indicator */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-r from-transparent via-[var(--color-highlight)] to-transparent mt-3 opacity-60"
            />

            {/* Real-time indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mt-2 text-xs text-glass-secondary"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-[var(--color-highlight)] rounded-full"
              />
              <span className="font-mono">Real-time data</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMetrics;