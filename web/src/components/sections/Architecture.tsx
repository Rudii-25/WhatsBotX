import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Monitor, Server, Database, MessageSquare, ArrowRight } from "lucide-react";
import { useRef } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const Architecture = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const cardsScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  const components = [
    { icon: Monitor, label: "Electron GUI", color: "from-blue-500 to-cyan-500" },
    { icon: Server, label: "Node.js Bot", color: "from-primary to-emerald-500" },
    { icon: MessageSquare, label: "Express API", color: "from-secondary to-purple-500" },
    { icon: Database, label: "SQLite Database", color: "from-orange-500 to-red-500" },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" 
      />
      
      {/* Floating decoration */}
      <motion.div
        className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Technical Architecture
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Built on{" "}
            <span className="text-gradient-primary">
              Modern Stack
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade architecture designed for scalability and reliability
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div 
            style={{ scale: cardsScale }}
            className="grid md:grid-cols-4 gap-6 mb-12"
          >
            {components.map((component, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-center group border-glow">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center`}
                  >
                    <component.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {component.label}
                  </h3>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border relative overflow-hidden border-glow">
              <DemoBadge variant="corner" label="Architecture Demo" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 text-center">Data Flow Architecture</h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {[
                    { icon: Monitor, label: "User Interface", color: "from-blue-500 to-cyan-500", shadowColor: "blue" },
                    { icon: Server, label: "Bot Engine", color: "from-primary to-emerald-500", shadowColor: "primary" },
                    { icon: MessageSquare, label: "API Layer", color: "from-secondary to-purple-500", shadowColor: "secondary" },
                    { icon: Database, label: "Data Store", color: "from-orange-500 to-red-500", shadowColor: "orange" },
                  ].map((item, idx) => (
                    <motion.div key={idx} className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="flex-1 text-center"
                      >
                        <motion.div 
                          className={`w-20 h-20 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          animate={{ 
                            boxShadow: [
                              `0 10px 30px hsl(var(--${item.shadowColor}) / 0.2)`,
                              `0 20px 40px hsl(var(--${item.shadowColor}) / 0.4)`,
                              `0 10px 30px hsl(var(--${item.shadowColor}) / 0.2)`,
                            ]
                          }}
                          // @ts-ignore
                          style={{ "--primary": "142 76% 36%", "--secondary": "217 91% 60%" }}
                        >
                          <item.icon className="w-10 h-10 text-white" />
                        </motion.div>
                        <p className="text-sm font-medium">{item.label}</p>
                      </motion.div>
                      
                      {idx < 3 && (
                        <motion.div
                          animate={{ 
                            x: [0, 10, 0],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          className="mx-2"
                        >
                          <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Electron", value: "Desktop" },
                    { label: "Node.js", value: "Runtime" },
                    { label: "Express", value: "REST API" },
                    { label: "SQLite", value: "Database" },
                  ].map((tech, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="p-3 bg-background rounded-lg border border-border text-center hover:border-primary/50 transition-all"
                    >
                      <div className="text-xs text-muted-foreground">{tech.label}</div>
                      <div className="font-semibold text-sm">{tech.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
