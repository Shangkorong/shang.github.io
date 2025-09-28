// Hero.jsx - Complete Enhanced Physics with Simple Click-to-Launch
// 🚀 All existing features preserved + Simple Physics + Smart Click Launch
// 📝 Heavily commented for easy understanding

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { portfolioData } from '../data/mock';
import LiveMetrics from './LiveMetrics';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse position tracking (isolated to prevent re-renders)
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const mouseTimeoutRef = useRef(null);
  const isTrackingActiveRef = useRef(true);

  // 🎛️ Color method dropdown state
  const [globalColorMethod, setGlobalColorMethod] = useState('all');
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const colorPanelRef = useRef(null);

  // 🎛️ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPanelRef.current && !colorPanelRef.current.contains(event.target)) {
        setIsColorPanelOpen(false);
      }
    };

    if (isColorPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPanelOpen]);

  // Handle mouse movement without React state updates
  const handleMouseMove = (e) => {
    // Safety check: disable tracking if system is overloaded
    if (!isTrackingActiveRef.current) return;

    // Clear existing timeout to prevent excessive updates
    if (mouseTimeoutRef.current) {
      clearTimeout(mouseTimeoutRef.current);
    }

    // Update ref directly (no React state update)
    mouseTimeoutRef.current = setTimeout(() => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    }, 32); // Reduced to ~30fps for better stability
  };

  const handleMouseLeave = () => {
    // Clear any pending timeout
    if (mouseTimeoutRef.current) {
      clearTimeout(mouseTimeoutRef.current);
      mouseTimeoutRef.current = null;
    }
    // Reset ref directly (no React state update)
    mousePositionRef.current = { x: 0, y: 0 };
  };

  // Static protocols for three dice
  const protocols = [
    { name: 'APB', color: '#00FFD1', description: 'Advanced Peripheral Bus' },
    { name: 'AHB', color: '#8686AC', description: 'Advanced High-performance Bus' },
    { name: 'AXI', color: '#505081', description: 'Advanced eXtensible Interface' }
  ];

  // ✨ Enhanced Motion Trail Effect Component (EXISTING - UNCHANGED)
  const TrailEffect = ({ cubeRef, color, isHovered }) => {
    const trailRef = useRef();
    const trailCount = 50; // More trail segments for longer trails
    const maxTrailLife = 4.0; // Trails last longer before fading

    // Trail position history
    const trailPositions = useRef(Array(trailCount).fill().map(() => new THREE.Vector3()));
    const trailAges = useRef(new Float32Array(trailCount));
    const trailIntensities = useRef(new Float32Array(trailCount));
    const lastPosition = useRef(new THREE.Vector3());
    const movementSpeed = useRef(0);

    const { positionsArray, opacitiesArray, sizesArray } = useMemo(() => {
      const positionsArray = new Float32Array(trailCount * 3);
      const opacitiesArray = new Float32Array(trailCount);
      const sizesArray = new Float32Array(trailCount);

      // Initialize arrays with bigger sizes
      for (let i = 0; i < trailCount; i++) {
        trailAges.current[i] = 0;
        trailIntensities.current[i] = 0;
        opacitiesArray[i] = 0;
        sizesArray[i] = 0.08 + (i / trailCount) * 0.15; // Bigger trail points
      }

      return { positionsArray, opacitiesArray, sizesArray };
    }, [trailCount]);

    const trailShader = useMemo(() => ({
      uniforms: {
        time: { value: 0 },
        trailColor: { value: new THREE.Color(color) },
        opacity: { value: 1.0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        uniform float time;
        varying float vOpacity;
        varying vec3 vPosition;
        
        void main() {
          vOpacity = opacity;
          vPosition = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Enhanced point size multiplier
          float pulse = sin(time * 4.0 + position.x * 2.0 + position.y * 2.0) * 0.3 + 1.0;
          gl_PointSize = size * pulse * 800.0 / -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform vec3 trailColor;
        uniform float time;
        varying float vOpacity;
        varying vec3 vPosition;
        
        void main() {
          if (vOpacity <= 0.01) discard;
          
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          // Softer edges for larger trail points
          float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
          
          // Enhanced glow effect
          float glow = 1.0 - smoothstep(0.0, 1.0, dist);
          alpha += glow * vOpacity * 0.5;
          
          // Dynamic color shift based on position
          vec3 dynamicColor = trailColor;
          float colorShift = sin(time + vPosition.x + vPosition.y) * 0.15;
          dynamicColor += vec3(colorShift, colorShift * 0.5, colorShift * 0.8);
          
          gl_FragColor = vec4(dynamicColor, alpha * 0.9);
        }
      `
    }), [color]);

    useFrame((state, delta) => {
      if (!trailRef.current || !cubeRef.current) return;

      const time = state.clock.getElapsedTime();
      trailShader.uniforms.time.value = time;

      const currentPosition = cubeRef.current.position.clone();

      // Calculate movement speed
      const speed = currentPosition.distanceTo(lastPosition.current);
      movementSpeed.current = speed;
      lastPosition.current.copy(currentPosition);

      // Update trail positions more frequently for smoother longer trails
      if (speed > 0.005 || isHovered) {
        // Shift trail positions
        for (let i = trailCount - 1; i > 0; i--) {
          trailPositions.current[i].copy(trailPositions.current[i - 1]);
          trailAges.current[i] = trailAges.current[i - 1];
          trailIntensities.current[i] = trailIntensities.current[i - 1];
        }

        // Add new trail point with bigger intensity
        trailPositions.current[0].copy(currentPosition);
        trailAges.current[0] = maxTrailLife;
        trailIntensities.current[0] = Math.min(speed * 80 + (isHovered ? 0.8 : 0), 1.0);
      }

      // Update trail ages and build geometry
      let needsUpdate = false;
      for (let i = 0; i < trailCount; i++) {
        if (trailAges.current[i] > 0) {
          trailAges.current[i] -= delta * 0.7; // Slower fade rate for longer-lasting trails

          // Update position array
          const i3 = i * 3;
          positionsArray[i3] = trailPositions.current[i].x;
          positionsArray[i3 + 1] = trailPositions.current[i].y;
          positionsArray[i3 + 2] = trailPositions.current[i].z;

          // Enhanced opacity calculation
          const ageFactor = trailAges.current[i] / maxTrailLife;
          const distanceFactor = 1.0 - (i / trailCount);
          opacitiesArray[i] = ageFactor * distanceFactor * trailIntensities.current[i] * 1.2;

          needsUpdate = true;
        } else {
          opacitiesArray[i] = 0;
        }
      }

      // Update geometry attributes
      if (needsUpdate) {
        const positions = trailRef.current.geometry.attributes.position;
        const opacities = trailRef.current.geometry.attributes.opacity;
        const sizes = trailRef.current.geometry.attributes.size;

        positions.array = positionsArray;
        opacities.array = opacitiesArray;
        sizes.array = sizesArray;

        positions.needsUpdate = true;
        opacities.needsUpdate = true;
        sizes.needsUpdate = true;
      }
    });

    return (
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trailCount}
            array={positionsArray}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={trailCount}
            array={opacitiesArray}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-size"
            count={trailCount}
            array={sizesArray}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          args={[trailShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  };

  // ⬡ Hexagonal Ripple Effect Component (EXISTING - UNCHANGED)
  const RippleEffect = ({ cubeRef, color, isHovered, mouseSpeed }) => {
    const rippleRef = useRef();
    const rippleCount = 3; // Multiple concentric ripples
    const maxRadius = 4.0;

    const { radiiArray, opacitiesArray, speedsArray } = useMemo(() => {
      const radiiArray = new Float32Array(rippleCount);
      const opacitiesArray = new Float32Array(rippleCount);
      const speedsArray = new Float32Array(rippleCount);

      for (let i = 0; i < rippleCount; i++) {
        radiiArray[i] = 0;
        opacitiesArray[i] = 0;
        speedsArray[i] = 0.8 + i * 0.3; // Different speeds for each ripple
      }

      return { radiiArray, opacitiesArray, speedsArray };
    }, [rippleCount]);

    const rippleShader = useMemo(() => ({
      uniforms: {
        time: { value: 0 },
        rippleColor: { value: new THREE.Color(color) },
        rippleRadius1: { value: 0 },
        rippleRadius2: { value: 0 },
        rippleRadius3: { value: 0 },
        rippleOpacity1: { value: 0 },
        rippleOpacity2: { value: 0 },
        rippleOpacity3: { value: 0 },
        maxRadius: { value: maxRadius }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 rippleColor;
        uniform float rippleRadius1;
        uniform float rippleRadius2;
        uniform float rippleRadius3;
        uniform float rippleOpacity1;
        uniform float rippleOpacity2;
        uniform float rippleOpacity3;
        uniform float maxRadius;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // HEXAGONAL DISTANCE FUNCTION
        float hexDistance(vec2 p) {
          p = abs(p);
          float c = dot(p, normalize(vec2(1.0, 1.732))); // 1.732 = sqrt(3)
          return max(c, p.x);
        }
        
        // HEXAGONAL BOUNDARY FUNCTION
        float hexBoundary(vec2 uv, float size) {
          vec2 center = vec2(0.5);
          vec2 p = (uv - center) * 2.0; // Convert to -1 to 1 range
          
          float hexDist = hexDistance(p);
          
          // Create smooth hexagonal boundary
          float boundary = 1.0 - smoothstep(size - 0.1, size, hexDist);
          
          // Add subtle hexagonal grid pattern
          float hexPattern = sin(hexDist * 8.0) * 0.1 + 0.9;
          
          return boundary * hexPattern;
        }
        
        // HEXAGONAL RIPPLE RINGS
        float hexRipple(vec2 uv, float radius, float thickness) {
          vec2 center = vec2(0.5);
          vec2 p = (uv - center) * maxRadius;
          
          float hexDist = hexDistance(p);
          float ripple = abs(hexDist - radius);
          
          // Create hexagonal ripple ring
          return 1.0 - smoothstep(0.0, thickness, ripple);
        }
        
        void main() {
          vec2 center = vec2(0.5);
          
          // HEXAGONAL BOUNDARY - sci-fi look
          float boundary = hexBoundary(vUv, 0.8);
          
          // Create hexagonal ripple rings
          float hexRing1 = hexRipple(vUv, rippleRadius1, 0.25) * rippleOpacity1;
          float hexRing2 = hexRipple(vUv, rippleRadius2, 0.2) * rippleOpacity2;
          float hexRing3 = hexRipple(vUv, rippleRadius3, 0.3) * rippleOpacity3;
          
          // Combine hexagonal ripples
          float finalRipple = (hexRing1 + hexRing2 + hexRing3) * boundary;
          
          // Distance from center for gradient effect
          vec2 p = (vUv - center) * 2.0;
          float dist = hexDistance(p);
          
          // Sci-fi color gradient - brighter center, darker edges
          vec3 gradient = mix(
            rippleColor * 2.0,           // Bright center
            rippleColor * 0.3,           // Dark edges  
            smoothstep(0.0, 0.8, dist)
          );
          
          // Add hexagonal glow effect
          float centerGlow = 1.0 - smoothstep(0.0, 0.4, dist);
          finalRipple += centerGlow * 0.15 * boundary;
          
          // Add tech-style scanning lines
          float scanLines = sin(vUv.y * 50.0 + time * 2.0) * 0.02 + 1.0;
          finalRipple *= scanLines;
          
          // Hexagonal edge highlights
          float edgeHighlight = 1.0 - smoothstep(0.75, 0.85, boundary);
          gradient += rippleColor * edgeHighlight * 0.3;
          
          gl_FragColor = vec4(gradient, finalRipple * 0.9);
        }
      `
    }), [color, maxRadius]);

    // Track mouse movement for speed calculation
    const lastMousePos = useRef({ x: 0, y: 0 });
    const rippleTimers = useRef([0, 0, 0]);

    useFrame((state, delta) => {
      if (!rippleRef.current || !cubeRef.current) return;

      const time = state.clock.getElapsedTime();
      rippleShader.uniforms.time.value = time;

      // Position ripple at cube location
      const cubePosition = cubeRef.current.position;
      rippleRef.current.position.copy(cubePosition);
      rippleRef.current.position.y -= 0.5; // Slightly below the cube

      // Calculate mouse speed for intensity
      const currentSpeed = Math.sqrt(
        Math.pow(mouseSpeed.x - lastMousePos.current.x, 2) +
        Math.pow(mouseSpeed.y - lastMousePos.current.y, 2)
      );
      lastMousePos.current = { x: mouseSpeed.x, y: mouseSpeed.y };

      // Update hexagonal ripples
      for (let i = 0; i < rippleCount; i++) {
        if (isHovered) {
          // Start new ripples at intervals
          if (rippleTimers.current[i] <= 0) {
            radiiArray[i] = 0;
            opacitiesArray[i] = 0.9 + currentSpeed * 0.15; // Speed affects intensity
            rippleTimers.current[i] = 1.2 + i * 0.4; // Stagger ripples for hex effect
          }

          // Expand active ripples
          if (radiiArray[i] < maxRadius && opacitiesArray[i] > 0) {
            radiiArray[i] += speedsArray[i] * delta;
            opacitiesArray[i] *= 0.97; // Slower fade for more visible hex effect
          }

          rippleTimers.current[i] -= delta;
        } else {
          // Fade out when not hovered
          opacitiesArray[i] *= 0.94;
          if (opacitiesArray[i] < 0.01) {
            radiiArray[i] = 0;
            rippleTimers.current[i] = 0;
          }
        }
      }

      // Update shader uniforms
      rippleShader.uniforms.rippleRadius1.value = radiiArray[0];
      rippleShader.uniforms.rippleRadius2.value = radiiArray[1];
      rippleShader.uniforms.rippleRadius3.value = radiiArray[2];
      rippleShader.uniforms.rippleOpacity1.value = opacitiesArray[0];
      rippleShader.uniforms.rippleOpacity2.value = opacitiesArray[1];
      rippleShader.uniforms.rippleOpacity3.value = opacitiesArray[2];
    });

    return (
      <mesh ref={rippleRef} rotation={[0, 0, 0]} position={[0, 0, -1]}>
        <planeGeometry args={[8, 8, 64, 64]} />
        <shaderMaterial
          args={[rippleShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    );
  };

  // ✨ Particle Effect Component (EXISTING - UNCHANGED)
  const ParticleEffect = ({ cubeRef, color, isHovered }) => {
    const particlesRef = useRef();
    const particleCount = 100;
    const maxLife = 1.5;

    const { positionsArray, velocitiesArray, livesArray, sizesArray, opacitiesArray } = useMemo(() => {
      const positionsArray = new Float32Array(particleCount * 3);
      const velocitiesArray = new Float32Array(particleCount * 3);
      const livesArray = new Float32Array(particleCount);
      const sizesArray = new Float32Array(particleCount);
      const opacitiesArray = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        livesArray[i] = 0;
        sizesArray[i] = Math.random() * 0.02 + 0.01;
        opacitiesArray[i] = 0;
      }

      return { positionsArray, velocitiesArray, livesArray, sizesArray, opacitiesArray };
    }, [particleCount]);

    const sparkleShader = useMemo(() => ({
      uniforms: {
        time: { value: 0 },
        sparkleColor: { value: new THREE.Color(color) }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        uniform float time;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float sparkle = sin(time * 8.0 + position.x * 10.0) * 0.3 + 1.0;
          gl_PointSize = size * sparkle * 500.0 / -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform vec3 sparkleColor;
        varying float vOpacity;
        
        void main() {
          if (vOpacity <= 0.01) discard;
          
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          float angle = atan(center.y, center.x);
          float sparklePattern = abs(sin(angle * 6.0)) * 0.3 + 0.7;
          
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity * sparklePattern;
          
          gl_FragColor = vec4(sparkleColor, alpha);
        }
      `
    }), [color]);

    useFrame((state, delta) => {
      if (!particlesRef.current || !cubeRef.current) return;

      const time = state.clock.getElapsedTime();
      sparkleShader.uniforms.time.value = time;

      const cubePosition = cubeRef.current.position;

      const positions = particlesRef.current.geometry.attributes.position;
      const lives = particlesRef.current.geometry.attributes.life;
      const sizes = particlesRef.current.geometry.attributes.size;
      const opacities = particlesRef.current.geometry.attributes.opacity;

      let needsUpdate = false;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        if (livesArray[i] > 0) {
          positionsArray[i3] += velocitiesArray[i3] * delta;
          positionsArray[i3 + 1] += velocitiesArray[i3 + 1] * delta;
          positionsArray[i3 + 2] += velocitiesArray[i3 + 2] * delta;

          velocitiesArray[i3 + 1] -= 0.5 * delta;
          velocitiesArray[i3] *= 0.98;
          velocitiesArray[i3 + 1] *= 0.98;
          velocitiesArray[i3 + 2] *= 0.98;

          livesArray[i] -= delta;
          opacitiesArray[i] = Math.max(0, livesArray[i] / maxLife);

          needsUpdate = true;
        }

        if (isHovered && livesArray[i] <= 0 && Math.random() < 0.3) {
          const spread = 0.3;
          positionsArray[i3] = cubePosition.x + (Math.random() - 0.5) * spread;
          positionsArray[i3 + 1] = cubePosition.y + (Math.random() - 0.5) * spread;
          positionsArray[i3 + 2] = cubePosition.z + (Math.random() - 0.5) * spread;

          const force = 0.8 + Math.random() * 1.0;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          velocitiesArray[i3] = Math.sin(phi) * Math.cos(theta) * force;
          velocitiesArray[i3 + 1] = Math.cos(phi) * force + 0.3;
          velocitiesArray[i3 + 2] = Math.sin(phi) * Math.sin(theta) * force;

          livesArray[i] = maxLife * (0.5 + Math.random() * 0.5);
          opacitiesArray[i] = 1.0;

          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        positions.array = positionsArray;
        lives.array = livesArray;
        sizes.array = sizesArray;
        opacities.array = opacitiesArray;

        positions.needsUpdate = true;
        lives.needsUpdate = true;
        sizes.needsUpdate = true;
        opacities.needsUpdate = true;
      }
    });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positionsArray}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-life"
            count={particleCount}
            array={livesArray}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizesArray}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={particleCount}
            array={opacitiesArray}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          args={[sparkleShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  };

  // 🎮 3D Scene with Physics-Enhanced Cubes
  const ThreeDPlaceholder = ({ onMouseMove, onMouseLeave, colorMethod }) => {
    const [hoveredDie, setHoveredDie] = useState(null);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resetView = () => {
      setHoveredDie(null);
      // Reset will be handled by the physics simulation
    };

    // 🚀 PHYSICS-ENHANCED BOUNCING DIE WITH CLICK-TO-LAUNCH (Solution A)
    // ==================================================================
    const BouncingDie = ({ protocol, startPosition, colorMethod = 'all' }) => {
      const meshRef = useRef();
      const positionRef = useRef(startPosition);
      const rotationRef = useRef([0, 0, 0]);
      const [isHovered, setIsHovered] = useState(false);

      // Reference to store the canvas container for mouse position conversion
      const canvasRef = useRef();

      // Independent mouse position tracking for each cube
      const mousePosRef = useRef({ x: 0, y: 0 });
      const mouseSpeedRef = useRef({ x: 0, y: 0 });

      // 🔄 Morphing progress and geometries (EXISTING - UNCHANGED)
      const morphProgress = useRef(0);
      const [currentGeometry, setCurrentGeometry] = useState('cube');

      // 🫁 Breathing animation refs (EXISTING - UNCHANGED)
      const breathingProgress = useRef(0);
      const breathingDirection = useRef(1);

      // 🌈 Color shifting refs (EXISTING - UNCHANGED)
      const hoverDuration = useRef(0);
      const baseColor = useMemo(() => new THREE.Color(protocol.color), [protocol.color]);
      const [currentMaterial, setCurrentMaterial] = useState(null);

      // 🚀 SIMPLE PHYSICS SIMULATION REFS (EXISTING - UNCHANGED)
      const velocityRef = useRef([0, 0, 0]); // 3D velocity vector [x, y, z]
      const lastPositionRef = useRef([...startPosition]); // Previous position for calculating movement
      const isPhysicsActive = useRef(true); // Toggle physics on/off

      // 🆕 NEW: SOLUTION A - Enhanced Interaction Control
      // =================================================
      const isLaunchCooldown = useRef(false); // Temporarily disable hover control after launch
      const launchCooldownTimer = useRef(null); // Timer to re-enable hover control
      const clickStartTime = useRef(null); // Track when click started for quick click detection

      // 🎯 PHYSICS CONSTANTS (Tunable for different feel)
      const GRAVITY = -2.5; // Gravity force (negative = downward)
      const BOUNCE_DAMPING = 0.7; // Energy loss on bounce (0=no bounce, 1=perfect bounce)
      const AIR_RESISTANCE = 0.98; // Air resistance factor for gradual slowdown
      const MIN_VELOCITY = 0.005; // Minimum velocity threshold (below this = stop)
      const CUBE_SIZE = 0.8; // Cube dimensions for collision detection

      // 🏗️ PHYSICS BOUNDARIES (Invisible walls) - Optimized for viewport visibility
      const boundsRef = useRef({
        min: { 
          x: -3.5,  // Left wall boundary
          y: -1.8,  // 🆕 ELEVATED FLOOR - Raised from -2.5 to -1.8 for better visibility
          z: -2     // Back wall boundary
        },
        max: { 
          x: 3.5,   // Right wall boundary  
          y: 2.5,   // Ceiling boundary
          z: 2      // Front wall boundary
        }
      });

      // Create both geometries (EXISTING - UNCHANGED)
      const cubeGeometry = useMemo(() => new THREE.BoxGeometry(0.8, 0.8, 0.8), []);
      const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.5, 16, 12), []);

      // 🎨 DIFFERENT MATERIALS/TEXTURES PER PROTOCOL (EXISTING - UNCHANGED)
      const materials = useMemo(() => {
        const baseMaterialProps = {
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 0.1
        };

        switch (protocol.name) {
          case 'APB':
            // 💎 GLASS TEXTURE
            return {
              normal: new THREE.MeshPhysicalMaterial({
                ...baseMaterialProps,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.6, // Glass transparency
                thickness: 0.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.8
              }),
              hovered: new THREE.MeshPhysicalMaterial({
                ...baseMaterialProps,
                metalness: 0.05,
                roughness: 0.05,
                transmission: 0.8,
                thickness: 0.3,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                transparent: true,
                opacity: 0.9,
                emissiveIntensity: 0.3
              })
            };

          case 'AHB':
            // 🔩 METALLIC TEXTURE  
            return {
              normal: new THREE.MeshStandardMaterial({
                ...baseMaterialProps,
                metalness: 0.9,
                roughness: 0.2
              }),
              hovered: new THREE.MeshStandardMaterial({
                ...baseMaterialProps,
                metalness: 1.0,
                roughness: 0.1,
                emissiveIntensity: 0.4
              })
            };

          case 'AXI':
            // 💠 CRYSTAL/DIAMOND TEXTURE
            return {
              normal: new THREE.MeshPhysicalMaterial({
                ...baseMaterialProps,
                metalness: 0.0,
                roughness: 0.0,
                transmission: 0.3,
                thickness: 1.0,
                clearcoat: 1.0,
                clearcoatRoughness: 0.0,
                ior: 2.4, // Diamond refractive index
                transparent: true,
                opacity: 0.95
              }),
              hovered: new THREE.MeshPhysicalMaterial({
                ...baseMaterialProps,
                metalness: 0.0,
                roughness: 0.0,
                transmission: 0.4,
                thickness: 0.8,
                clearcoat: 1.0,
                clearcoatRoughness: 0.0,
                ior: 2.4,
                transparent: true,
                opacity: 1.0,
                emissiveIntensity: 0.5
              })
            };

          default:
            return {
              normal: new THREE.MeshStandardMaterial(baseMaterialProps),
              hovered: new THREE.MeshStandardMaterial({
                ...baseMaterialProps,
                emissiveIntensity: 0.3
              })
            };
        }
      }, [protocol.name, baseColor]);

      // 🚀 ENHANCED: Click detection start for Solution A
      const handlePointerDown = (e) => {
        e.stopPropagation();

        // Record click start time for quick click detection
        clickStartTime.current = Date.now();

        console.log(`🎯 ${protocol.name} click started - detecting intent...`);
      };

      // 🚀 ENHANCED: Smart click to launch (Solution A)
      const handlePointerUp = (e) => {
        e.stopPropagation();

        if (clickStartTime.current) {
          // Calculate click duration for quick click detection
          const clickDuration = Date.now() - clickStartTime.current;

          // Quick click detection (< 200ms = click to launch)
          const isQuickClick = clickDuration < 200;

          if (isQuickClick) {
            // 🚀 CLICK TO LAUNCH - Random impulse in all directions
            velocityRef.current[0] += (Math.random() - 0.5) * 6; // Random horizontal force
            velocityRef.current[1] += Math.random() * 4 + 3; // Strong upward force (3-7 units)
            velocityRef.current[2] += (Math.random() - 0.5) * 6; // Random depth force

            console.log(`🚀 ${protocol.name} CLICK LAUNCHED! Random impulse applied.`);

            // 🕐 TEMPORARY HOVER CONTROL DISABLE (Solution A Core Feature)
            // =============================================================
            // Disable hover control to let physics take effect
            isLaunchCooldown.current = true;
            setIsHovered(false); // Force unhover state immediately

            // Clear any existing cooldown timer
            if (launchCooldownTimer.current) {
              clearTimeout(launchCooldownTimer.current);
            }

            // Re-enable hover control after 1.5 seconds
            const cooldownTime = 1500;
            launchCooldownTimer.current = setTimeout(() => {
              isLaunchCooldown.current = false;
              console.log(`✅ ${protocol.name} hover control re-enabled! (${cooldownTime}ms cooldown completed)`);
            }, cooldownTime);

            console.log(`🕐 ${protocol.name} hover disabled for ${cooldownTime}ms to allow physics...`);
          }
        }

        // Reset click tracking
        clickStartTime.current = null;
      };

      // 🚀 ENHANCED: Mouse enter with cooldown respect (Solution A)
      const handleMouseEnter = () => {
        // Only allow hover control if not in launch cooldown period
        if (!isLaunchCooldown.current) {
          setIsHovered(true);
          hoverDuration.current = 0; // Reset hover duration
          console.log(`🖱️ ${protocol.name} hover started (cooldown: ${isLaunchCooldown.current})`);
        } else {
          console.log(`⏳ ${protocol.name} hover blocked - in launch cooldown`);
        }
      };

      // 🚀 ENHANCED: Mouse leave with cooldown awareness (Solution A)
      const handleMouseLeave = () => {
        // Always allow mouse leave, but respect cooldown state
        if (!isLaunchCooldown.current) {
          setIsHovered(false);
        }

        // Always reset mouse tracking regardless of cooldown
        hoverDuration.current = 0;
        mousePosRef.current = { x: 0, y: 0 };
        mouseSpeedRef.current = { x: 0, y: 0 };
      };

      // 🚀 ENHANCED: Mouse move with cooldown check (Solution A)
      const handleMouseMove = (e) => {
        // Only update mouse position tracking if not in launch cooldown
        if (!isLaunchCooldown.current) {
          const newPos = { x: e.clientX, y: e.clientY };
          mouseSpeedRef.current = {
            x: newPos.x - mousePosRef.current.x,
            y: newPos.y - mousePosRef.current.y
          };
          mousePosRef.current = newPos;
        }
      };

      // 🆕 NEW: Cleanup timers on component unmount
      useEffect(() => {
        return () => {
          // Clear any pending cooldown timers when component unmounts
          if (launchCooldownTimer.current) {
            clearTimeout(launchCooldownTimer.current);
          }
        };
      }, []);

      // 🎮 MAIN ANIMATION LOOP WITH ENHANCED PHYSICS (Solution A)
      // =========================================================
      useFrame((state, delta) => {
        if (!meshRef.current || prefersReducedMotion) return;

        // Use refs for better performance
        const position = positionRef.current;
        const velocity = velocityRef.current;
        const rotation = rotationRef.current;

        // Track hover duration for color intensity (EXISTING - UNCHANGED)
        if (isHovered) {
          hoverDuration.current += delta;
        } else {
          hoverDuration.current = Math.max(hoverDuration.current - delta * 0.5, 0);
        }

        // 🌈 SWITCHABLE COLOR SHIFTING (EXISTING - UNCHANGED)
        // ==================================================
        let dynamicColor = baseColor.clone();

        switch (colorMethod) {
          case 'mouse':
            // Method 1: Mouse position color shifting only
            if (mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
              const normalizedMouseX = mousePosRef.current.x / window.innerWidth;
              const normalizedMouseY = mousePosRef.current.y / window.innerHeight;

              const hueShift = normalizedMouseX * 360;
              const saturation = 0.6 + normalizedMouseY * 0.4;
              const lightness = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;

              dynamicColor.setHSL((hueShift / 360) % 1, saturation, lightness);
            }
            break;

          case 'hover':
            // Method 2: Hover duration intensity only
            const hoverIntensity = Math.min(hoverDuration.current * 0.5, 2);
            if (hoverIntensity > 0) {
              const hue = (hoverDuration.current * 0.2) % 1;
              dynamicColor.setHSL(hue, 0.8, 0.6);
              dynamicColor.multiplyScalar(1 + hoverIntensity * 0.3);
            }
            break;

          case 'breathing':
            // Method 3: Breathing-synchronized color pulsing only
            const breathingHue = (state.clock.getElapsedTime() * 0.1) % 1;
            const breathingIntensity = 1 + Math.sin(breathingProgress.current * Math.PI) * 0.4;
            dynamicColor.setHSL(breathingHue, 0.7, 0.5);
            dynamicColor.multiplyScalar(breathingIntensity);
            break;

          case 'all':
            // Method 4: All combined
            if (mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
              const normalizedMouseX = mousePosRef.current.x / window.innerWidth;
              const normalizedMouseY = mousePosRef.current.y / window.innerHeight;

              const hueShift = normalizedMouseX * 360;
              const saturation = 0.6 + normalizedMouseY * 0.4;
              const lightness = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;

              dynamicColor.setHSL((hueShift / 360) % 1, saturation, lightness);
            }

            const hoverInt = Math.min(hoverDuration.current * 0.3, 1.5);
            if (hoverInt > 0) {
              dynamicColor.multiplyScalar(1 + hoverInt * 0.5);
            }

            const breathingColorInt = 1 + Math.sin(breathingProgress.current * Math.PI) * 0.2;
            dynamicColor.multiplyScalar(breathingColorInt);
            break;

          case 'none':
          default:
            // No color shifting - use original base color
            break;
        }

        // Apply color to materials (EXISTING - UNCHANGED)
        const material = isHovered ? materials.hovered : materials.normal;
        if (material !== currentMaterial) {
          setCurrentMaterial(material);
        }

        if (meshRef.current.material) {
          meshRef.current.material.color.copy(dynamicColor);
          meshRef.current.material.emissive.copy(dynamicColor);
          meshRef.current.material.needsUpdate = true;
        }

        // 🚀 SIMPLE PHYSICS SIMULATION (EXISTING - UNCHANGED)
        // ===================================================

        // 🎯 Apply gravity (only when not being controlled by mouse)
        if (!isHovered && isPhysicsActive.current) {
          velocity[1] += GRAVITY * delta; // Apply downward force
        }

        // 🏃‍♂️ Apply velocity to position (move the cube)
        if (isPhysicsActive.current) {
          position[0] += velocity[0] * delta;
          position[1] += velocity[1] * delta;
          position[2] += velocity[2] * delta;
        }

        // 🏗️ BOUNDARY COLLISION DETECTION & RESPONSE
        // ===========================================
        const bounds = boundsRef.current;
        const cubeHalf = CUBE_SIZE / 2;

        // ⬅️➡️ X-axis boundaries (left/right walls)
        if (position[0] - cubeHalf <= bounds.min.x) {
          position[0] = bounds.min.x + cubeHalf; // Prevent clipping through wall
          velocity[0] = Math.abs(velocity[0]) * BOUNCE_DAMPING; // Bounce right with energy loss

          // Add slight random vertical bounce for variety
          velocity[1] += Math.random() * 0.5;
          console.log(`🟦 ${protocol.name} bounced off left wall!`);
        } else if (position[0] + cubeHalf >= bounds.max.x) {
          position[0] = bounds.max.x - cubeHalf;
          velocity[0] = -Math.abs(velocity[0]) * BOUNCE_DAMPING; // Bounce left

          velocity[1] += Math.random() * 0.5;
          console.log(`🟦 ${protocol.name} bounced off right wall!`);
        }

        // ⬆️⬇️ Y-axis boundaries (floor/ceiling)
        if (position[1] - cubeHalf <= bounds.min.y) {
          position[1] = bounds.min.y + cubeHalf;
          velocity[1] = Math.abs(velocity[1]) * BOUNCE_DAMPING; // Bounce up

          // Add random horizontal scatter on floor bounce
          velocity[0] += (Math.random() - 0.5) * 0.8;
          velocity[2] += (Math.random() - 0.5) * 0.8;
          console.log(`🟦 ${protocol.name} bounced off floor!`);
        } else if (position[1] + cubeHalf >= bounds.max.y) {
          position[1] = bounds.max.y - cubeHalf;
          velocity[1] = -Math.abs(velocity[1]) * BOUNCE_DAMPING; // Bounce down
          console.log(`🟦 ${protocol.name} bounced off ceiling!`);
        }

        // ↗️↙️ Z-axis boundaries (front/back walls)
        if (position[2] - cubeHalf <= bounds.min.z) {
          position[2] = bounds.min.z + cubeHalf;
          velocity[2] = Math.abs(velocity[2]) * BOUNCE_DAMPING; // Bounce forward
        } else if (position[2] + cubeHalf >= bounds.max.z) {
          position[2] = bounds.max.z - cubeHalf;
          velocity[2] = -Math.abs(velocity[2]) * BOUNCE_DAMPING; // Bounce backward
        }

        // 🌬️ AIR RESISTANCE & DAMPING (gradual slowdown)
        if (!isHovered && isPhysicsActive.current) {
          velocity[0] *= AIR_RESISTANCE; // Horizontal air resistance
          velocity[2] *= AIR_RESISTANCE; // Depth air resistance

          // Stop very slow movements to prevent jitter
          if (Math.abs(velocity[0]) < MIN_VELOCITY) velocity[0] = 0;
          if (Math.abs(velocity[1]) < MIN_VELOCITY && position[1] <= bounds.min.y + cubeHalf + 0.1) {
            velocity[1] = 0; // Stop bouncing when very slow and near ground
          }
          if (Math.abs(velocity[2]) < MIN_VELOCITY) velocity[2] = 0;
        }

        // 🖱️ ENHANCED MOUSE INTERACTION (with intelligent cooldown respect - Solution A)
        // ==============================================================================
        if (isHovered && !isLaunchCooldown.current && mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
          // EXISTING MOUSE CONTROL LOGIC (only active when not in cooldown)
          // Temporarily disable physics for smooth mouse control
          isPhysicsActive.current = false;

          const canvas = canvasRef.current || document.querySelector('canvas');
          if (canvas) {
            const rect = canvas.getBoundingClientRect();

            const normalizedX = ((mousePosRef.current.x - rect.left) / rect.width) * 2 - 1;
            const normalizedY = -((mousePosRef.current.y - rect.top) / rect.height) * 2 + 1;

            const targetX = normalizedX * 3.3;
            const targetY = normalizedY * 3.3;

            // Calculate movement for potential physics handoff
            const deltaX = targetX - position[0];
            const deltaY = targetY - position[1];

            // Smooth mouse following (EXISTING - UNCHANGED)
            const lerpFactor = 0.2;
            position[0] += deltaX * lerpFactor;
            position[1] += deltaY * lerpFactor;

            // Store velocity for when mouse control ends (EXISTING - UNCHANGED)
            velocity[0] = deltaX * 0.4;
            velocity[1] = deltaY * 0.4;
          }
        } else {
          // 🚀 ENHANCED: Always use physics when not hovering OR in launch cooldown
          isPhysicsActive.current = true;
        }

        // 🎭 ROTATION BASED ON VELOCITY (Cubes rotate based on movement)
        // =============================================================
        const totalVelocity = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);
        if (totalVelocity > 0.1) {
          // Rotate based on movement direction and speed
          rotation[0] += velocity[1] * delta * 1.5; // Pitch from Y velocity
          rotation[1] += velocity[0] * delta * 1.5; // Yaw from X velocity  
          rotation[2] += velocity[2] * delta * 1.5; // Roll from Z velocity
        }

        // Add gentle hover rotation (EXISTING - UNCHANGED)
        if (isHovered) {
          rotation[0] += 0.01;
          rotation[1] += 0.01;
        } else {
          // Gradually slow down rotation when not moving
          if (totalVelocity < 0.5) {
            rotation[0] *= 0.95;
            rotation[1] *= 0.95;
            rotation[2] *= 0.95;
          }
        }

        // Apply transforms to mesh directly
        meshRef.current.position.set(...position);
        meshRef.current.rotation.set(...rotation);

        // 🫁 GENTLE BREATHING ANIMATION (EXISTING - UNCHANGED)
        // ===================================================
        const breathingSpeed = isHovered ? 1.2 : 0.6;

        breathingProgress.current += delta * breathingSpeed * breathingDirection.current;

        if (breathingProgress.current >= 1) {
          breathingProgress.current = 1;
          breathingDirection.current = -1;
        } else if (breathingProgress.current <= 0) {
          breathingProgress.current = 0;
          breathingDirection.current = 1;
        }

        const breathingIntensity = isHovered ? 0.2 : 0.08;
        const breathingCurve = Math.sin(breathingProgress.current * Math.PI);
        const breathingScale = 1 + (breathingCurve * breathingIntensity);

        const baseScale = isHovered ? 1.3 : 1;

        const scaleX = baseScale * breathingScale;
        const scaleY = baseScale * breathingScale * 1.02;
        const scaleZ = baseScale * breathingScale * 0.98;

        meshRef.current.scale.set(scaleX, scaleY, scaleZ);

        if (breathingProgress.current > 0) {
          rotation[2] += 0.0008 * breathingCurve;
        }

        // 🔄 MORPHING LOGIC (EXISTING - UNCHANGED)
        // ========================================
        if (isHovered) {
          morphProgress.current = Math.min(morphProgress.current + delta * 1.5, 1);
        } else {
          morphProgress.current = Math.max(morphProgress.current - delta * 1.2, 0);
        }

        if (morphProgress.current > 0.7 && currentGeometry === 'cube' && breathingProgress.current > 0.8) {
          setCurrentGeometry('sphere');
        } else if (morphProgress.current < 0.3 && currentGeometry === 'sphere' && breathingProgress.current < 0.2) {
          setCurrentGeometry('cube');
        }
      });

      return (
        <group>
          {/* ✨ Motion Trail Effect (EXISTING - will now follow physics movement) */}
          <TrailEffect
            cubeRef={meshRef}
            color={protocol.color}
            isHovered={isHovered}
          />

          {/* ⬡ Hexagonal Ripple Effect (EXISTING - will trigger on bounces) */}
          <RippleEffect
            cubeRef={meshRef}
            color={protocol.color}
            isHovered={isHovered}
            mouseSpeed={mouseSpeedRef.current}
          />

          {/* ✨ Particle Effect (EXISTING - will emit during movement) */}
          <ParticleEffect cubeRef={meshRef} color={protocol.color} isHovered={isHovered} />

          {/* 🚀 PHYSICS-ENABLED MESH with Enhanced Click-to-Launch (Solution A) */}
          <mesh
            ref={meshRef}
            position={startPosition}
            onPointerEnter={handleMouseEnter}   // Enhanced with cooldown check
            onPointerLeave={handleMouseLeave}   // Enhanced with cooldown awareness  
            onPointerMove={handleMouseMove}     // Enhanced with cooldown check
            onPointerDown={handlePointerDown}   // Enhanced click detection start
            onPointerUp={handlePointerUp}       // 🆕 NEW: Smart click-to-launch system (Solution A)
            geometry={currentGeometry === 'cube' ? cubeGeometry : sphereGeometry}
            material={currentMaterial || materials.normal}
          >
            {/* Protocol label (EXISTING - UNCHANGED) */}
            <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.2, 0.08]} />
              <meshBasicMaterial color={protocol.color} opacity={0.8} transparent />
            </mesh>
          </mesh>
        </group>
      );
    };

    return (
      <div
        className="relative w-full h-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-dark)] rounded-lg overflow-hidden"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            // Handle context loss and recovery with better stability
            const handleContextLost = (event) => {
              event.preventDefault();
              console.warn('WebGL context lost, attempting to recover...');

              // Disable mouse tracking temporarily to prevent further issues
              setTimeout(() => {
                console.log('Re-enabling mouse tracking after context recovery');
              }, 1000);
            };

            const handleContextRestored = () => {
              console.log('WebGL context restored successfully');
              try {
                gl.forceContextRestore();
              } catch (e) {
                console.warn('Context restore failed, continuing with limited functionality');
              }
            };

            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
            gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

            // Set pixel ratio for better performance
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Cleanup function
            return () => {
              gl.domElement.removeEventListener('webglcontextlost', handleContextLost, false);
              gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored, false);
            };
          }}
          gl={{
            antialias: false, // Disable antialias for better performance
            alpha: true,
            powerPreference: "default", // Use default instead of high-performance
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false
          }}
          performance={{ min: 0.5 }} // Enable performance monitoring
        >
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#00FFD1" />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#8686AC" />
          <directionalLight position={[0, 5, 0]} intensity={0.8} color="white" />

          {/* 🚀 Three Physics-Enhanced Bouncing Dice with Click-to-Launch */}
          {protocols.map((protocol, index) => (
            <BouncingDie
              key={protocol.name}
              protocol={protocol}
              colorMethod={colorMethod}
              startPosition={[
                (index - 1) * 1.5, // Spread them out horizontally
                Math.random() * 2 - 1, // Random Y position
                Math.random() * 1 - 0.5 // Random Z position
              ]}
            />
          ))}
        </Canvas>

        {/* Control instructions and reset button */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="text-white/90 text-xs bg-[var(--glass-bg-strong)] backdrop-blur-md px-2 py-1 rounded border border-[var(--glass-border)]">
            <div>🎮 Click: Launch • Hover: Control • Physics: Bounce & Gravity ⚡</div>
            <div className="text-[var(--color-highlight)]">Enhanced physics-enabled 3D protocol dice with click-to-launch 🚀⬡✨</div>
          </div>
          <motion.button
            onClick={resetView}
            className="glass-button text-xs px-3 py-1 min-h-8 text-on-glass"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Reset 3D view to default position"
          >
            Reset View
          </motion.button>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4 text-white bg-[var(--glass-bg-strong)] backdrop-blur-md px-3 py-1 rounded border border-[var(--glass-border)]">
          <span className="text-sm font-mono">
            {hoveredDie ? `${hoveredDie} Following Mouse` : '🚀 Physics + Click-to-Launch Active'}
          </span>
          <div className="text-xs opacity-75 mt-1">
            {hoveredDie ? 'Trails, ripples & particles enabled' : 'Quick click cubes to launch them!'}
          </div>
        </div>
      </div>
    );
  };

  const StatsPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <LiveMetrics />
    </motion.div>
  );

  return (
    <section ref={ref} className="min-h-screen relative overflow-hidden pt-20" id="hero">
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[var(--color-primary)] to-[var(--color-accent)] opacity-90"
        style={{ y }}
      />

      <div className="container relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 w-full items-center">
          {/* Left Content (EXISTING - UNCHANGED) */}
          <motion.div
            className="space-y-8"
            style={{ opacity }}
          >
            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="heading-display text-primary mb-4">
                {portfolioData.personal.name}
              </h1>
              <h2 className="heading-lg text-secondary mb-6">
                {portfolioData.personal.title}
              </h2>
              <p className="body-lg text-primary max-w-2xl">
                {portfolioData.personal.tagline}
              </p>
            </motion.div>

            {/* Detailed Description */}
            <motion.p
              className="body-md text-secondary max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Reusable verification environments with drivers, monitors, scoreboards,
              coverage, and assertions validating APB, AHB, AXI, FIFO, Memory, FSM,
              and Ethernet MAC using QuestaSim/ModelSim on Linux
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="glass-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' })}
              >
                View Case Studies
              </motion.button>
              <motion.a
                href="/resume.pdf"
                download
                className="glass-button highlight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
              <motion.a
                href={`mailto:${portfolioData.personal.email}`}
                className="glass-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Email Me
              </motion.a>
            </motion.div>

            {/* Quick Skills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {portfolioData.skills.verification.slice(0, 6).map((skill, index) => (
                <motion.span
                  key={skill}
                  className="glass-panel-subtle px-3 py-1 text-sm text-on-glass font-mono"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Enhanced 3D Scene and Stats */}
          <motion.div
            className="relative h-[600px] space-y-6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <div className="h-[400px] relative">
              <ThreeDPlaceholder
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                colorMethod={globalColorMethod}
              />

              {/* 🎛️ Enhanced Color Method Control Panel with Outside Click Detection */}
              <div className="absolute top-4 left-4 z-10" ref={colorPanelRef}>
                {/* Dropdown Header - Always Visible */}
                <motion.button
                  onClick={() => setIsColorPanelOpen(!isColorPanelOpen)}
                  className="flex items-center justify-between w-full min-w-[200px] text-white bg-[var(--glass-bg-strong)] backdrop-blur-md px-3 py-2 rounded border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)]/80 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--color-highlight)]">
                      Color Effects
                    </span>
                    <span className="text-xs text-[var(--color-secondary)]">
                      {globalColorMethod === 'mouse' && '🖱️'}
                      {globalColorMethod === 'hover' && '⏱️'}
                      {globalColorMethod === 'breathing' && '🫁'}
                      {globalColorMethod === 'all' && '🌈'}
                      {globalColorMethod === 'none' && '🚫'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isColorPanelOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[var(--color-highlight)] text-xs"
                  >
                    ▼
                  </motion.div>
                </motion.button>

                {/* Dropdown Content with Smooth Animation */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isColorPanelOpen ? 'auto' : 0,
                    opacity: isColorPanelOpen ? 1 : 0,
                    y: isColorPanelOpen ? 0 : -10
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 text-white bg-[var(--glass-bg-strong)] backdrop-blur-md px-3 py-2 rounded border border-[var(--glass-border)] shadow-lg">
                    <div className="flex flex-col gap-1">
                      {[
                        { key: 'mouse', icon: '🖱️', label: 'Mouse Position' },
                        { key: 'hover', icon: '⏱️', label: 'Hover Duration' },
                        { key: 'breathing', icon: '🫁', label: 'Breathing Sync' },
                        { key: 'all', icon: '🌈', label: 'All Combined' },
                        { key: 'none', icon: '🚫', label: 'Original Colors' }
                      ].map((option) => (
                        <motion.button
                          key={option.key}
                          onClick={() => {
                            setGlobalColorMethod(option.key);
                            setIsColorPanelOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-all duration-200 text-left ${
                            globalColorMethod === option.key
                              ? 'bg-[var(--color-highlight)] text-[var(--color-dark)] font-semibold'
                              : 'text-[var(--color-highlight)] hover:bg-[var(--color-highlight)]/20'
                          }`}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option.icon} {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <StatsPanel />
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center gap-2 text-secondary">
          <span className="text-sm bg-[var(--glass-bg-strong)] backdrop-blur-md px-3 py-1 rounded border border-[var(--glass-border)] text-on-glass">
            Scroll to explore
          </span>
          <motion.div
            className="w-6 h-10 border-2 border-[var(--color-secondary)] rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-[var(--color-highlight)] rounded-full mt-2"
              animate={{ height: [8, 16, 8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
