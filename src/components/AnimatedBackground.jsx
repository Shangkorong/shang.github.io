import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Smart particle count based on device
  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 30 : 80; // Mobile: 30, Desktop: 80
  
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const startX = Math.random() * 1600 - 800;
    const startY = Math.random() * 1600 - 800;
    const endX = Math.random() * 400 - 200;
    const endY = Math.random() * 400 - 200;

    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: isMobile ? Math.random() * 2 + 1 : Math.random() * 3 + 2, // Smaller on mobile
      duration: isMobile ? Math.random() * 1.2 + 0.6 : Math.random() * 1.5 + 0.8,
      delay: Math.random() * 10,
      opacity: isMobile ? Math.random() * 0.6 + 0.4 : Math.random() * 0.8 + 0.4,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
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
      }}
    >
      {/* Shooting Star Particles */}
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
          {/* Comet head (bright point) */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(0, 255, 255, ${particle.opacity * 1.2}), rgba(0, 255, 255, ${particle.opacity * 0.6}) 50%, transparent)`,
              boxShadow: `0 0 ${particle.size * 3}px rgba(0, 255, 255, ${particle.opacity * 0.8}), 0 0 ${particle.size * 6}px rgba(0, 255, 255, ${particle.opacity * 0.4})`,
            }}
          />

          {/* Comet tail (streak) - ALIGNED WITH HEAD */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${particle.size * 30}px`,
              height: `${particle.size * 0.8}px`,
              background: `linear-gradient(90deg, rgba(0, 255, 255, ${particle.opacity * 0.6}), transparent)`,
              transform: `translate(0, -50%) rotate(${Math.atan2(particle.startY - particle.endY, particle.startX - particle.endX) * (180 / Math.PI)}deg)`,
              transformOrigin: 'left center',
              filter: 'blur(1.5px)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      ))}

      {/* Animated gradient mesh */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          pointerEvents: 'none',
          position: 'relative', // ADDED: This fixes the Framer Motion warning
        }}
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 50% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating orb 1 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.45), rgba(0, 255, 255, 0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating orb 2 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.40), rgba(0, 255, 255, 0.12) 50%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
          opacity: [0.55, 0.85, 0.55],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating orb 3 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '45%',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.42), rgba(0, 255, 255, 0.13) 50%, transparent 70%)',
          filter: 'blur(85px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 120, 0],
          y: [0, -70, 0],
          scale: [1, 1.25, 1],
          opacity: [0.58, 0.88, 0.58],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
