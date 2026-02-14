import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface DemoBadgeProps {
  variant?: "default" | "floating" | "corner";
  label?: string;
}

const DemoBadge = ({ variant = "default", label = "Demo Preview" }: DemoBadgeProps) => {
  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
      </motion.div>
    );
  }

  if (variant === "corner") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">{label}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 border border-border rounded-full"
    >
      <Eye className="w-3 h-3 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </motion.div>
  );
};

export default DemoBadge;
