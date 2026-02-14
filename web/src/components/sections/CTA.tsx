import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/forms";
import { Github, Download, ArrowRight, Star } from "lucide-react";
import { useRef } from "react";
import Terminal3D from "@/components/3d/Terminal3D";

const CTA = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background with parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" 
      />
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div 
        style={{ scale }}
        className="container mx-auto px-4 relative z-10" 
        ref={ref}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <motion.span 
              className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary"
              whileHover={{ scale: 1.05 }}
            >
              🎉 100% Open Source & Free Forever
            </motion.span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-5xl lg:text-6xl font-bold mb-6"
          >
            Ready to Automate{" "}
            <span className="text-gradient-primary">
              WhatsApp?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Join thousands of users already using WhatsBotX to streamline their WhatsApp workflow.
            Get started in minutes with our easy setup process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="https://github.com/Rudii-25/WhatsBotX" target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg" className="gap-2 text-lg px-8 py-6 h-auto magnetic-button">
                  <Github className="w-6 h-6" />
                  View on GitHub
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="/download">
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6 h-auto magnetic-button">
                  <Download className="w-6 h-6" />
                  Download Now
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            {[
              { icon: Star, text: "5+ GitHub Stars", fill: true },
              { icon: Download, text: "100+ Downloads" },
              { icon: null, text: "Made with ❤️ by Rudra Sharma", emoji: "💖" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }}
              >
                {item.icon ? (
                  <item.icon className={`w-5 h-5 text-primary ${item.fill ? 'fill-primary' : ''}`} />
                ) : (
                  <span className="text-primary">{item.emoji}</span>
                )}
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Terminal showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-16 h-[300px] max-w-3xl mx-auto"
        >
          <Terminal3D />
        </motion.div>

        {/* Floating cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Quick Start", desc: "Setup in under 5 minutes", icon: "🚀" },
            { title: "Free Forever", desc: "100% open source, no hidden costs", icon: "💎" },
            { title: "Active Community", desc: "Join our Discord for support", icon: "👥" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: 0.8 + idx * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all border-glow"
            >
              <motion.div 
                className="text-4xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, delay: idx * 0.3, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
