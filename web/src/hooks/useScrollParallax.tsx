import { useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";

interface ParallaxConfig {
  inputRange?: [number, number];
  outputRange?: [number, number];
}

interface UseScrollParallaxReturn {
  scrollYProgress: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  x: MotionValue<number>;
}

export const useScrollParallax = (
  ref: RefObject<HTMLElement>,
  config?: {
    y?: ParallaxConfig;
    opacity?: ParallaxConfig;
    scale?: ParallaxConfig;
    rotate?: ParallaxConfig;
    x?: ParallaxConfig;
  }
): UseScrollParallaxReturn => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    config?.y?.inputRange || [0, 1],
    config?.y?.outputRange || [100, -100]
  );

  const opacity = useTransform(
    scrollYProgress,
    config?.opacity?.inputRange || [0, 0.2, 0.8, 1],
    config?.opacity?.outputRange || [0, 1, 1, 0] as number[]
  );

  const scale = useTransform(
    scrollYProgress,
    config?.scale?.inputRange || [0, 0.5, 1],
    config?.scale?.outputRange || [0.8, 1, 0.8] as number[]
  );

  const rotate = useTransform(
    scrollYProgress,
    config?.rotate?.inputRange || [0, 1],
    config?.rotate?.outputRange || [-5, 5]
  );

  const x = useTransform(
    scrollYProgress,
    config?.x?.inputRange || [0, 1],
    config?.x?.outputRange || [-50, 50]
  );

  return { scrollYProgress, y, opacity, scale, rotate, x };
};

export const useParallaxLayer = (
  ref: RefObject<HTMLElement>,
  speed: number = 0.5
) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return { y, scrollYProgress };
};

export default useScrollParallax;
