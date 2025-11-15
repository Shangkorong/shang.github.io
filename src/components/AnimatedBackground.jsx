import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Detect device and reduced motion preference
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth <= 768);
    
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for window resize
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Skip all animations if user prefers reduced motion
  if (prefersReducedMotion) return null;

  // Aggressive optimization for mobile
  const particleCount = isMobile ? 8 : 40; // Drastically reduced for mobile
  const blurAmount = isMobile ? 40 : 80;   // Half blur on mobile
  const orbSize = isMobile ? 400 : 600;    // Smaller orbs on mobile

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const startX = Math.random() * 1600 - 800;
    const startY = Math.random() * 1600 - 800;
    const endX = Math.random() * 400 - 200;
    const endY = Math.random() * 400 - 200;

    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: isMobile ? Math.random() * 1.5 + 1 : Math.random() * 3 + 2,
      duration: isMobile ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 0.8,
      delay: Math.random() * 10,
      opacity: isMobile ? Math.random() * 0.5 + 0.3 : Math.random() * 0.8 + 0.4,
      startX,
      startY,
      endX,
      endY,
    };
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Force GPU acceleration
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
    >
      {/* Shooting Star Particles - Optimized */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            pointerEvents: 'none',
            // Force GPU layer
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
          }}
          initial={{
            x: particle.startX,
            y: particle.startY,
            opacity: 0,
          }}
          animate={{
            x: [particle.startX, particle.endX],
            y: [particle.startY, particle.endY],
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeOut',
            delay: particle.delay,
            repeatDelay: Math.random() * 5 + 3,
          }}
        >
          {/* Comet head */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(0, 255, 255, ${particle.opacity * 1.2}), rgba(0, 255, 255, ${particle.opacity * 0.6}) 50%, transparent)`,
              boxShadow: `0 0 ${particle.size * 3}px rgba(0, 255, 255, ${particle.opacity * 0.8})`,
            }}
          />

          {/* Comet tail - simplified for mobile */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${particle.size * 20}px`, // Shorter tail
                height: `${particle.size * 0.8}px`,
                background: `linear-gradient(90deg, rgba(0, 255, 255, ${particle.opacity * 0.6}), transparent)`,
                transform: `translate(0, -50%) rotate(${
                  Math.atan2(particle.startY - particle.endY, particle.startX - particle.endX) * (180 / Math.PI)
                }deg)`,
                transformOrigin: 'left center',
                filter: 'blur(1px)', // Minimal blur
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Animated gradient mesh - desktop only */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
          }}
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.2) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.2) 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Floating orb 1 - Optimized with reduced blur */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.3), rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
          filter: `blur(${blurAmount}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          // Critical for mobile performance
          transform: 'translate3d(0, 0, 0)',
          willChange: isMobile ? 'transform' : 'transform, opacity',
        }}
        animate={{
          x: isMobile ? [0, 50, 0] : [0, 100, 0],
          y: isMobile ? [0, -25, 0] : [0, -50, 0],
          scale: isMobile ? 1 : [1, 1.1, 1],
          opacity: isMobile ? 0.4 : [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: isMobile ? 8 : 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating orb 2 - Optimized */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '15%',
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.25), rgba(0, 255, 255, 0.08) 50%, transparent 70%)',
          filter: `blur(${blurAmount}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          transform: 'translate3d(0, 0, 0)',
          willChange: isMobile ? 'transform' : 'transform, opacity',
        }}
        animate={{
          x: isMobile ? [0, -40, 0] : [0, -80, 0],
          y: isMobile ? [0, 30, 0] : [0, 60, 0],
          scale: isMobile ? 1 : [1, 1.08, 1],
          opacity: isMobile ? 0.35 : [0.45, 0.65, 0.45],
        }}
        transition={{
          duration: isMobile ? 10 : 13,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating orb 3 - Desktop only or heavily simplified on mobile */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '45%',
            width: `${orbSize}px`,
            height: `${orbSize}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.28), rgba(0, 255, 255, 0.09) 50%, transparent 70%)',
            filter: `blur(${blurAmount}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
          }}
          animate={{
            x: [0, 120, 0],
            y: [0, -70, 0],
            scale: [1, 1.15, 1],
            opacity: [0.48, 0.68, 0.48],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
