import { useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";

interface MagneticEffectOptions {
  strength?: number;
  damping?: number;
  stiffness?: number;
}

export const useMagneticEffect = (options: MagneticEffectOptions = {}) => {
  const { strength = 0.3, damping = 15, stiffness = 150 } = options;
  
  const ref = useRef<HTMLElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping, stiffness };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    
    x.set(distanceX);
    y.set(distanceY);
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    ref,
    style: {
      x: xSpring,
      y: ySpring,
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};

export default useMagneticEffect;
