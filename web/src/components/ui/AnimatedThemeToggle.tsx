import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Stars, CloudMoon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const AnimatedThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 overflow-hidden"
      style={{
        background: isDark 
          ? "linear-gradient(135deg, hsl(240 20% 15%), hsl(260 30% 25%))" 
          : "linear-gradient(135deg, hsl(200 80% 70%), hsl(40 90% 65%))",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background decoration */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute w-3 h-2 bg-white/40 rounded-full"
              style={{ left: "15%", top: "30%" }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-4 h-2 bg-white/30 rounded-full"
              style={{ left: "55%", top: "50%" }}
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle circle */}
      <motion.div
        className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: isDark 
            ? "linear-gradient(135deg, hsl(45 90% 70%), hsl(45 90% 90%))" 
            : "linear-gradient(135deg, hsl(45 100% 55%), hsl(35 100% 65%))",
        }}
        animate={{
          x: isDark ? 0 : 32,
          rotate: isDark ? 0 : 360,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-4 h-4 text-slate-700" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-4 h-4 text-amber-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark
            ? "0 0 20px hsl(260 50% 50% / 0.3), inset 0 0 15px hsl(260 50% 30% / 0.2)"
            : "0 0 20px hsl(45 100% 60% / 0.4), inset 0 0 15px hsl(200 80% 60% / 0.2)",
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};

export default AnimatedThemeToggle;
