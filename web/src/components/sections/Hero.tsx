import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/forms";
import { Star, Download, ArrowRight, Zap, MessageSquare, Bot, Shield } from "lucide-react";
import { ParticleField, FloatingRobot, FloatingIcons, RotatingWhatsAppLogo, AnimatedMessageBubbles } from "@/components/3d";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";

const Hero = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const stats = [
    { value: "41+", label: "Commands", icon: Zap },
    { value: "50-100", label: "MB Memory", icon: Shield },
    { value: "1000+", label: "Users", icon: MessageSquare },
    { value: "24/7", label: "Uptime", icon: Bot },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-20 overflow-hidden">
      {/* Particle Background with parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <ParticleField />
      </motion.div>
      
      {/* Floating Icons with parallax */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }} className="absolute inset-0">
        <FloatingIcons className="opacity-50" />
      </motion.div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <motion.div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <motion.div 
        style={{ opacity, scale, y }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Rotating WhatsApp Logo - Mobile */}
            <div className="lg:hidden flex justify-center mb-6">
              <RotatingWhatsAppLogo size="sm" />
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Version 2.1.4 Now Available
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-gradient-primary">🚀 WhatsBotX</span>
              <br />
              <span className="text-foreground">Complete WhatsApp</span>
              <br />
              <span className="text-gradient-secondary">Automation Solution</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              AI Assistant • Bulk Messaging • Professional GUI • 41+ Commands
              <br />
              <span className="text-sm">Automate your WhatsApp business with enterprise-grade features</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/download">
                <Button variant="hero" size="lg" className="gap-2 group w-full sm:w-auto magnetic-button">
                  <Download className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 border-primary/30 hover:bg-primary/10 magnetic-button">
                <Star className="w-5 h-5" />
                Star on GitHub
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-card rounded-xl p-4 text-center border-glow"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - 3D Robot & Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[400px] lg:h-[600px] relative hidden lg:block"
          >
            <FloatingRobot />
            
            {/* Animated Message Bubbles overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <AnimatedMessageBubbles />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="absolute top-10 right-0 glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">Ready to help</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="absolute bottom-20 left-0 glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium">Bulk Messaging</div>
                  <div className="text-xs text-muted-foreground">1 msg/sec rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
