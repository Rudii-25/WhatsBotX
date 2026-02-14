import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const TerminalContent = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [lines, setLines] = useState<string[]>([]);
  
  const commands = [
    "$ npm start whatsbotx --demo",
    "✓ [DEMO] Loading WhatsBotX v1.0...",
    "✓ [DEMO] Connecting to WhatsApp...",
    "✓ [DEMO] QR Code generated!",
    "✓ [DEMO] Session authenticated",
    "✓ [DEMO] 41 commands loaded",
    "✓ [DEMO] AI Assistant ready",
    "$ [DEMO] Bot is running! 🚀",
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < commands.length) {
        setLines(prev => [...prev.slice(-5), commands[currentIndex]]);
        currentIndex++;
      } else {
        currentIndex = 0;
        setLines([]);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Terminal frame */}
        <RoundedBox args={[5, 3, 0.3]} radius={0.15}>
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.5}
            roughness={0.3}
          />
        </RoundedBox>
        
        {/* Terminal screen */}
        <RoundedBox args={[4.6, 2.4, 0.1]} radius={0.1} position={[0, -0.1, 0.15]}>
          <meshStandardMaterial 
            color="#0f0f1a" 
            emissive="#0f0f1a"
            emissiveIntensity={0.2}
          />
        </RoundedBox>
        
        {/* Window controls */}
        <group position={[-2, 1.2, 0.2]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#ff5f56" emissive="#ff5f56" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#ffbd2e" emissive="#ffbd2e" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.5, 0, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#27ca40" emissive="#27ca40" emissiveIntensity={0.5} />
          </mesh>
        </group>
        
        {/* Terminal title */}
        <Text
          position={[0, 1.2, 0.2]}
          fontSize={0.12}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          WhatsBotX Terminal
        </Text>
        
        {/* Terminal lines */}
        {lines.filter(Boolean).map((line, idx) => (
          <Text
            key={idx}
            position={[-2.1, 0.7 - idx * 0.35, 0.2]}
            fontSize={0.14}
            color={line?.startsWith("$") ? "#25D366" : line?.startsWith("✓") ? "#27ca40" : "#00ff88"}
            anchorX="left"
            anchorY="middle"
            maxWidth={4.2}
          >
            {line}
          </Text>
        ))}
        
        {/* Cursor */}
        <mesh position={[-2.1 + (lines[lines.length - 1]?.length || 0) * 0.08, 0.7 - (lines.length - 1) * 0.35, 0.2]}>
          <boxGeometry args={[0.1, 0.18, 0.02]} />
          <meshStandardMaterial 
            color="#25D366" 
            emissive="#25D366" 
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Terminal3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full h-full min-h-[300px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#25D366" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#007bff" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.4}
          penumbra={1}
          intensity={0.6}
          color="#ffffff"
        />
        <TerminalContent />
      </Canvas>
    </div>
  );
};

export default Terminal3D;
