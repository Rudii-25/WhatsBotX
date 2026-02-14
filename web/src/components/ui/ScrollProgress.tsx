import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Color interpolation based on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "hsl(142, 76%, 36%)",
      "hsl(180, 76%, 40%)",
      "hsl(217, 91%, 60%)",
    ]
  );

  // Glow intensity based on scroll
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.8]);

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
        style={{
          scaleX,
          backgroundColor,
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 z-[59] origin-left blur-sm"
        style={{
          scaleX,
          backgroundColor,
          opacity: glowOpacity,
        }}
      />

      {/* Progress percentage indicator - moved to bottom right */}
      <motion.div
        className="fixed bottom-4 right-4 z-[60] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor }}
        />
        <motion.span className="text-xs font-medium text-muted-foreground">
          {useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`)}
        </motion.span>
      </motion.div>

      {/* Scroll indicator dots (visible on scroll) */}
      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[55] hidden lg:flex flex-col gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((threshold, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full border border-primary/30"
            style={{
              backgroundColor: useTransform(
                scrollYProgress,
                [threshold - 0.05, threshold, threshold + 0.05],
                ["transparent", "hsl(var(--primary))", "transparent"]
              ),
              scale: useTransform(
                scrollYProgress,
                [threshold - 0.05, threshold, threshold + 0.05],
                [0.8, 1.2, 0.8]
              ),
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default ScrollProgress;
