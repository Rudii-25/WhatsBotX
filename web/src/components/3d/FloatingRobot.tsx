import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Box, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const Robot = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Robot Head */}
        <RoundedBox args={[2, 2, 1.5]} radius={0.3} position={[0, 1.5, 0]}>
          <MeshDistortMaterial
            color="#25D366"
            distort={0.1}
            speed={2}
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
        
        {/* Eyes */}
        <Sphere args={[0.25]} position={[-0.5, 1.7, 0.8]}>
          <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.25]} position={[0.5, 1.7, 0.8]}>
          <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.5} />
        </Sphere>
        
        {/* Eye pupils */}
        <Sphere args={[0.12]} position={[-0.5, 1.7, 0.95]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        <Sphere args={[0.12]} position={[0.5, 1.7, 0.95]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        
        {/* Antenna */}
        <Box args={[0.1, 0.6, 0.1]} position={[0, 2.8, 0]}>
          <meshStandardMaterial color="#007bff" metalness={0.9} roughness={0.1} />
        </Box>
        <Sphere args={[0.15]} position={[0, 3.15, 0]}>
          <meshStandardMaterial color="#007bff" emissive="#007bff" emissiveIntensity={0.8} />
        </Sphere>
        
        {/* Body */}
        <RoundedBox args={[2.5, 2.5, 1.5]} radius={0.3} position={[0, -1, 0]}>
          <MeshDistortMaterial
            color="#1e3a5f"
            distort={0.05}
            speed={1.5}
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>
        
        {/* WhatsApp Logo on chest */}
        <Box args={[0.8, 0.8, 0.1]} position={[0, -0.8, 0.8]}>
          <meshStandardMaterial color="#25D366" emissive="#25D366" emissiveIntensity={0.3} />
        </Box>
        
        {/* Arms */}
        <RoundedBox args={[0.4, 1.5, 0.4]} radius={0.1} position={[-1.7, -0.8, 0]}>
          <meshStandardMaterial color="#25D366" metalness={0.6} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.4, 1.5, 0.4]} radius={0.1} position={[1.7, -0.8, 0]}>
          <meshStandardMaterial color="#25D366" metalness={0.6} roughness={0.4} />
        </RoundedBox>
      </group>
    </Float>
  );
};

const FloatingRobot = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#25D366" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#007bff" />
        <spotLight
          position={[0, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Robot />
      </Canvas>
    </div>
  );
};

export default FloatingRobot;
