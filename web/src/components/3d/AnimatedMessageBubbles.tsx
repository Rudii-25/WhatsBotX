import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface BubbleProps {
  position: [number, number, number];
  color: string;
  text: string;
  delay: number;
  isOutgoing?: boolean;
}

const MessageBubble = ({ position, color, text, delay, isOutgoing = false }: BubbleProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.02;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Bubble background */}
        <RoundedBox args={[2, 0.6, 0.2]} radius={0.15}>
          <meshStandardMaterial 
            color={color} 
            metalness={0.1}
            roughness={0.3}
            transparent
            opacity={0.95}
          />
        </RoundedBox>
        
        {/* Bubble tail */}
        <mesh position={[isOutgoing ? 0.9 : -0.9, -0.25, 0]} rotation={[0, 0, isOutgoing ? -0.5 : 0.5]}>
          <coneGeometry args={[0.12, 0.2, 3]} />
          <meshStandardMaterial color={color} transparent opacity={0.95} />
        </mesh>
        
        {/* Text */}
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.15}
          color={isOutgoing ? "#ffffff" : "#1a1a1a"}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {text}
        </Text>
        
        {/* Time indicator */}
        <Text
          position={[0.7, -0.15, 0.15]}
          fontSize={0.08}
          color={isOutgoing ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
          anchorX="right"
          anchorY="middle"
        >
          ✓✓
        </Text>
      </group>
    </Float>
  );
};

const AnimatedMessageBubbles = ({ className = "" }: { className?: string }) => {
  const messages = useMemo(() => [
    { position: [-1.5, 1.2, 0] as [number, number, number], color: "#e8e8e8", text: "Hey! How are you?", delay: 0, isOutgoing: false },
    { position: [1.5, 0.4, 0.5] as [number, number, number], color: "#25D366", text: "I'm great! Thanks 🚀", delay: 1, isOutgoing: true },
    { position: [-1.2, -0.4, 0.2] as [number, number, number], color: "#e8e8e8", text: "Check out WhatsBotX!", delay: 2, isOutgoing: false },
    { position: [1.2, -1.2, 0.3] as [number, number, number], color: "#25D366", text: "Already using it! 💚", delay: 3, isOutgoing: true },
  ], []);

  return (
    <div className={`w-full h-full min-h-[300px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#25D366" />
        
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} {...msg} />
        ))}
      </Canvas>
    </div>
  );
};

export default AnimatedMessageBubbles;
