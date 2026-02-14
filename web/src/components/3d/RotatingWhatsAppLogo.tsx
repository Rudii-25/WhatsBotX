import { motion } from "framer-motion";

interface RotatingWhatsAppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const RotatingWhatsAppLogo = ({ className = "", size = "md" }: RotatingWhatsAppLogoProps) => {
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  };

  const iconSize = sizeMap[size];

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: iconSize, height: iconSize }}
      animate={{ 
        y: [0, -8, 0],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-[22%] bg-primary/40 blur-2xl"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main WhatsApp icon */}
      <motion.svg
        viewBox="0 0 175.216 175.552"
        className="relative z-10 w-full h-full drop-shadow-2xl"
        animate={{ 
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ filter: "drop-shadow(0 10px 30px rgba(37, 211, 102, 0.4))" }}
      >
        <defs>
          <linearGradient id="whatsappGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="100%" stopColor="#128C7E" />
          </linearGradient>
        </defs>
        
        {/* Background shape */}
        <path
          fill="url(#whatsappGradient)"
          d="M87.882 14.617c-40.43 0-73.293 32.863-73.293 73.293 0 12.907 3.349 25.438 9.714 36.5l-10.32 37.72 38.65-10.136c10.59 5.779 22.548 8.822 34.87 8.822h.032c40.397 0 73.26-32.863 73.26-73.293 0-19.578-7.625-37.985-21.473-51.833-13.848-13.848-32.255-21.473-51.44-21.473z"
        />
        
        {/* Phone icon */}
        <path
          fill="#FFFFFF"
          d="M126.82 105.996c-1.846-.922-10.923-5.39-12.617-6.006-1.694-.615-2.926-.922-4.157.922-1.232 1.846-4.773 6.006-5.852 7.238-1.078 1.232-2.156 1.386-4.003.462-1.846-.922-7.794-2.874-14.848-9.158-5.49-4.89-9.197-10.936-10.275-12.782-1.078-1.846-.115-2.845.81-3.767.831-.83 1.846-2.156 2.77-3.234.922-1.078 1.232-1.846 1.846-3.08.615-1.23.308-2.31-.154-3.234-.461-.922-4.157-10.023-5.697-13.715-1.5-3.6-3.024-3.113-4.157-3.172-1.078-.052-2.31-.064-3.542-.064-1.232 0-3.234.462-4.927 2.31-1.694 1.846-6.468 6.32-6.468 15.42 0 9.1 6.622 17.893 7.545 19.125.922 1.232 13.03 19.893 31.568 27.9 4.41 1.905 7.853 3.042 10.537 3.895 4.428 1.407 8.46 1.208 11.645.732 3.553-.53 10.923-4.465 12.463-8.777 1.54-4.31 1.54-8.006 1.078-8.777-.462-.768-1.694-1.232-3.54-2.154z"
        />
      </motion.svg>
    </motion.div>
  );
};

export default RotatingWhatsAppLogo;
