import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

interface IconProps {
  position: [number, number, number];
  color: string;
  delay?: number;
}

const FloatingBox = ({ position, color, delay = 0 }: IconProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + delay) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + delay;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

const FloatingSphere = ({ position, color, delay = 0 }: IconProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

const FloatingTorus = ({ position, color, delay = 0 }: IconProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime + delay;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

const FloatingIcons = ({ className = "" }: { className?: string }) => {
  const icons = useMemo(() => [
    { Component: FloatingBox, position: [-4, 2, -2] as [number, number, number], color: "#25D366", delay: 0 },
    { Component: FloatingSphere, position: [4, -1, -3] as [number, number, number], color: "#007bff", delay: 1 },
    { Component: FloatingTorus, position: [-3, -2, -1] as [number, number, number], color: "#25D366", delay: 2 },
    { Component: FloatingBox, position: [3, 3, -2] as [number, number, number], color: "#007bff", delay: 0.5 },
    { Component: FloatingSphere, position: [-5, 0, -4] as [number, number, number], color: "#25D366", delay: 1.5 },
    { Component: FloatingTorus, position: [5, 1, -3] as [number, number, number], color: "#007bff", delay: 2.5 },
  ], []);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#25D366" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#007bff" />
        {icons.map(({ Component, position, color, delay }, idx) => (
          <Component key={idx} position={position} color={color} delay={delay} />
        ))}
      </Canvas>
    </div>
  );
};

export default FloatingIcons;
