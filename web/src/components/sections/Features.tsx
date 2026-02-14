import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Bot, MessageSquare, Users, Zap, Shield, Clock } from "lucide-react";
import { Card } from "@/components/ui/layout";
import { useRef } from "react";

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Web Integration",
    description: "Seamless QR code connection with automatic reconnection and session management",
    color: "from-primary to-emerald-500",
  },
  {
    icon: Bot,
    title: "41+ Built-in Commands",
    description: "/help, /ai, /joke, /todo, /reminder, /weather, /translate, /qr, /autoreply, /status and more",
    color: "from-secondary to-purple-500",
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description: "Database-backed user management with role-based access and permissions",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Smart Auto-Reply",
    description: "Intelligent message detection and automated responses with custom triggers",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with encrypted connections and data protection",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Clock,
    title: "Real-time Processing",
    description: "Lightning-fast message handling with less than 100ms processing time",
    color: "from-pink-500 to-rose-500",
  },
];

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Parallax Background gradient */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" 
      />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
        animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"
        animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold text-primary uppercase tracking-wider"
          >
            Core Features
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mt-4 mb-6"
          >
            Everything You Need for{" "}
            <span className="text-gradient-primary">
              WhatsApp Automation
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Powerful features designed to streamline your WhatsApp workflow and boost productivity
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -12,
                rotateY: 5,
                rotateX: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group tilt-3d border-glow">
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)`,
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
