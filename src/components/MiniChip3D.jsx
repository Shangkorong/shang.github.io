import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from './ErrorBoundary';

// Mini 3D chip component for cards
const ChipMesh = ({ isHovered, type = 'chip' }) => {
  const meshRef = useRef();
  const [time, setTime] = useState(0);
  
  // Create particle refs at component level (not inside useEffect)
  const particleRefs = useMemo(() => {
    if (type === 'protocol') {
      return Array.from({ length: 4 }, () => ({ current: null }));
    }
    return [];
  }, [type]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update time
    setTime((prev) => prev + delta);

    // Base rotation - slower when not hovered
    const rotationSpeed = isHovered ? 0.8 : 0.25;
    meshRef.current.rotation.y += delta * rotationSpeed;

    // Emissive intensity change on hover
    if (meshRef.current.material) {
      const targetIntensity = isHovered ? 0.3 : 0;
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetIntensity,
        delta * 5
      );
    }

    // Animate particles for protocol type
    if (type === 'protocol' && particleRefs.length > 0) {
      particleRefs.forEach((particle, index) => {
        if (particle.current) {
          const offset = (time + index * 0.8) % 2;
          particle.current.position.x = -1 + offset;
          particle.current.position.z = (index - 1.5) * 0.3;
          particle.current.material.opacity = isHovered ? 0.8 : 0.4;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main chip geometry */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial
          color={isHovered ? '#8686AC' : '#505081'}
          emissive={'#00FFD1'}
          emissiveIntensity={0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Inner circuit pattern */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial
          color={'#00FFD1'}
          emissive={'#00FFD1'}
          emissiveIntensity={isHovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Protocol particles */}
      {type === 'protocol' && particleRefs.map((ref, index) => (
        <mesh key={index} ref={ref} position={[-1, 0.1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color={'#00FFD1'}
            emissive={'#00FFD1'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Connection lanes for protocol */}
      {type === 'protocol' && (
        <group>
          <mesh position={[0, 0.02, -0.3]}>
            <boxGeometry args={[2, 0.01, 0.05]} />
            <meshStandardMaterial
              color={isHovered ? '#8686AC' : '#505081'}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[2, 0.01, 0.05]} />
            <meshStandardMaterial
              color={isHovered ? '#8686AC' : '#505081'}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.02, 0.3]}>
            <boxGeometry args={[2, 0.01, 0.05]} />
            <meshStandardMaterial
              color={isHovered ? '#8686AC' : '#505081'}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Fallback SVG component
const ChipSVGFallback = ({ type }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    className="text-[var(--color-accent)]"
  >
    <rect x="20" y="35" width="60" height="30" fill="currentColor" rx="4" />
    <rect x="30" y="40" width="40" height="20" fill="#00FFD1" opacity="0.6" rx="2" />
    {type === 'protocol' && (
      <g>
        <circle cx="25" cy="50" r="2" fill="#00FFD1" opacity="0.8" />
        <circle cx="35" cy="50" r="2" fill="#00FFD1" opacity="0.6" />
        <circle cx="65" cy="50" r="2" fill="#00FFD1" opacity="0.6" />
        <circle cx="75" cy="50" r="2" fill="#00FFD1" opacity="0.4" />
      </g>
    )}
  </svg>
);

const MiniChip3D = ({ isHovered = false, type = 'chip', className = "" }) => {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef();

  // Check WebGL support with error handling
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    } catch (error) {
      console.warn('WebGL support check failed:', error);
      setWebGLSupported(false);
    }
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Respect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Check WebGL support with error handling

  if (!webGLSupported || prefersReducedMotion) {
    return (
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        <ChipSVGFallback type={type} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      {isInView && (
        <ErrorBoundary fallback="3D visualization unavailable">
          <Canvas
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            gl={{
              powerPreference: "high-performance",
              antialias: false,
              stencil: false,
              depth: false
            }}
          >
            <OrthographicCamera makeDefault zoom={80} position={[0, 2, 5]} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[2, 2, 5]} intensity={0.6} />
            <ChipMesh isHovered={isHovered} type={type} />
          </Canvas>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default MiniChip3D;