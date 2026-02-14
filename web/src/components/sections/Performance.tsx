import { motion, useMotionValue, useTransform, animate, useScroll } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/layout";
import { Progress } from "@/components/ui/feedback";
import { Zap, Clock, Cpu, HardDrive, Shield, TrendingUp } from "lucide-react";

const Performance = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const cardsY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  const count1 = useMotionValue(0);
  const count2 = useMotionValue(0);
  const count3 = useMotionValue(0);
  const count4 = useMotionValue(0);

  const rounded1 = useTransform(count1, (latest) => Math.round(latest));
  const rounded2 = useTransform(count2, (latest) => Math.round(latest));
  const rounded3 = useTransform(count3, (latest) => Math.round(latest));
  const rounded4 = useTransform(count4, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      animate(count1, 3, { duration: 2 });
      animate(count2, 100, { duration: 2 });
      animate(count3, 1, { duration: 2 });
      animate(count4, 75, { duration: 2 });
    }
  }, [inView, count1, count2, count3, count4]);

  const metrics = [
    {
      icon: Clock,
      label: "Startup Time",
      value: rounded1,
      unit: "sec",
      description: "Lightning-fast initialization",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      label: "Message Processing",
      value: rounded2,
      unit: "ms",
      description: "Real-time message handling",
      color: "from-primary to-emerald-500",
    },
    {
      icon: TrendingUp,
      label: "Bulk Rate",
      value: rounded3,
      unit: "msg/sec",
      description: "Controlled message delivery",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: HardDrive,
      label: "Memory Usage",
      value: rounded4,
      unit: "MB",
      description: "Efficient resource utilization",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-card/30 relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        style={{ scale: backgroundScale }}
        className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-secondary/5 pointer-events-none"
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Performance Metrics
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Built for{" "}
            <span className="text-gradient-primary">
              Speed & Reliability
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade performance with minimal resource footprint
          </p>
        </motion.div>

        <motion.div 
          style={{ y: cardsY }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 h-full group border-glow">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <metric.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-4xl font-bold mb-2 flex items-baseline gap-1">
                  <motion.span className="text-primary">{metric.value}</motion.span>
                  <span className="text-xl text-muted-foreground">{metric.unit}</span>
                </div>
                <h3 className="font-semibold mb-2">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border border-glow">
            <h3 className="text-2xl font-bold mb-8 text-center">System Health & Reliability</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { icon: Cpu, label: "CPU Efficiency", value: 95, color: "text-primary" },
                  { icon: HardDrive, label: "Memory Optimization", value: 92, color: "text-secondary" },
                  { icon: Shield, label: "Security Score", value: 98, color: "text-primary" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                    <Progress value={inView ? item.value : 0} className="h-3" />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { title: "Auto-Reconnection", desc: "Automatic recovery from connection drops", color: "primary" },
                  { title: "Error Recovery", desc: "Intelligent error handling and retry logic", color: "secondary" },
                  { title: "99.9% Uptime", desc: "Production-grade reliability and stability", color: "primary" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Card className={`p-4 bg-${item.color}/5 border-${item.color}/20`}>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className={`w-2 h-2 rounded-full bg-${item.color}`}
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <div>
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Performance;
