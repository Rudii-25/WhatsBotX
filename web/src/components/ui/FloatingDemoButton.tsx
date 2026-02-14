import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingDemoButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.6;
      const demoSection = document.getElementById("gui-showcase");
      
      if (demoSection) {
        const demoTop = demoSection.offsetTop;
        setHasScrolledPast(scrollY > demoTop);
      }
      
      setIsVisible(scrollY > heroHeight && !hasScrolledPast);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledPast]);

  const scrollToDemo = () => {
    const demoSection = document.getElementById("gui-showcase");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToDemo}
          className="fixed bottom-20 left-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full shadow-lg shadow-primary/30 font-medium text-sm cursor-pointer"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Play className="w-4 h-4 fill-current" />
          </motion.div>
          <span className="hidden sm:inline">Try the Demo</span>
          <span className="sm:hidden">Demo</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingDemoButton;
