import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const EnhancedCard = ({ 
  children, 
  className = '', 
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ariaLabel,
  has3D = false,
  render3D,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const springConfig = {
    stiffness: 420,
    damping: 32,
    mass: 0.7
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  };

  // Motion variants
  const cardVariants = {
    initial: {
      y: 0,
      scale: 1,
      opacity: 1
    },
    hover: prefersReducedMotion ? {} : {
      y: -6,
      scale: 1.02,
      opacity: 1.02,
      transition: springConfig
    },
    tap: prefersReducedMotion ? {} : {
      scale: 0.995,
      transition: { duration: 0.1 }
    },
    focus: {
      transition: springConfig
    }
  };

  // Border styles for hover and focus states
  const borderStyle = {
    borderColor: isFocused 
      ? 'rgba(0, 255, 209, 0.6)'  // #00FFD1 at 60% opacity for focus
      : isHovered 
        ? 'rgba(134, 134, 172, 0.35)'  // #8686AC at 35% opacity for hover
        : 'var(--glass-border)'
  };

  // Enhanced glass panel classes with hover state
  const cardClasses = `
    glass-panel 
    cursor-pointer 
    transition-all 
    duration-200 
    hover:backdrop-blur-md
    ${isFocused ? 'ring-2 ring-[var(--color-highlight)] ring-opacity-60' : ''}
    ${className}
  `;

  return (
    <motion.div
      className={cardClasses}
      style={{
        ...borderStyle,
        // Static box shadow for depth - not animated for performance
        boxShadow: isHovered || isFocused 
          ? 'var(--glass-shadow), 0 0 0 1px rgba(134, 134, 172, 0.2)'
          : 'var(--glass-shadow)'
      }}
      variants={cardVariants}
      initial="initial"
      whileHover={!prefersReducedMotion ? "hover" : undefined}
      whileTap={!prefersReducedMotion ? "tap" : undefined}
      animate={isFocused ? "focus" : "initial"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {/* 3D accent area */}
      {has3D && render3D && (
        <div className="absolute top-4 right-4 w-16 h-16 opacity-80">
          {render3D(isHovered)}
        </div>
      )}
      
      {/* Card content */}
      <div className={has3D ? 'pr-20' : ''}>
        {/* Enhanced contrast backplate on hover */}
        <div 
          className="relative"
          style={{
            backgroundColor: isHovered 
              ? 'rgba(39, 39, 87, 0.06)'  // 4-6% alpha bump for contrast
              : 'transparent'
          }}
        >
          {children}
        </div>
      </div>

      {/* Enhanced focus indicator for high contrast mode */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 border-2 border-[var(--color-highlight)] rounded-lg pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </motion.div>
  );
};

export default EnhancedCard;