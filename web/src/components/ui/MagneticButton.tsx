import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

const MagneticButton = ({ 
  children, 
  className = "", 
  strength = 0.3,
  onClick 
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Subtle rotation based on position
  const rotateX = useTransform(ySpring, [-20, 20], [5, -5]);
  const rotateY = useTransform(xSpring, [-20, 20], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      
      {/* Magnetic field indicator */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] bg-primary/5 -z-10"
        style={{
          scale: useTransform(
            [xSpring, ySpring],
            ([latestX, latestY]) => {
              const distance = Math.sqrt(
                (latestX as number) ** 2 + (latestY as number) ** 2
              );
              return 1 + distance * 0.01;
            }
          ),
        }}
      />
    </motion.div>
  );
};

export default MagneticButton;
