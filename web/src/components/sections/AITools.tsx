import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Card } from "@/components/ui/layout";
import { Button } from "@/components/ui/forms";
import { Bot, CheckCircle, Trash2, Cloud, Languages, Newspaper } from "lucide-react";
import { DemoBadge } from "@/components/ui/custom";

const AITools = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const floatingY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const tools = [
    { icon: Bot, label: "AI Assistant", color: "text-primary" },
    { icon: CheckCircle, label: "Todo Manager", color: "text-blue-500" },
    { icon: Cloud, label: "Weather", color: "text-cyan-500" },
    { icon: Languages, label: "Translate", color: "text-purple-500" },
    { icon: Newspaper, label: "News", color: "text-orange-500" },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-card/30 relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        style={{ rotate: backgroundRotate }}
        className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Productivity Suite
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            AI & Productivity{" "}
            <span className="text-gradient-secondary">
              Powerhouse
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Intelligent assistant and tools to boost your productivity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ y: floatingY }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border h-full flex flex-col border-glow relative overflow-hidden">
              <DemoBadge variant="corner" label="AI Demo" />
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold">AI Chat Assistant</h3>
              </div>

              {/* Chat Container */}
              <div className="space-y-4 mb-6 flex-1 min-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Message 1: User */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="flex-1">
                    <motion.div 
                      className="bg-background rounded-2xl rounded-tl-none p-3 border border-border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm">How can I automate my WhatsApp messages?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Message 2: Bot */}
                <motion.div 
                  className="flex gap-3 justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex-1 max-w-[80%]">
                    <motion.div 
                      className="bg-gradient-to-br from-secondary to-purple-600 rounded-2xl rounded-tr-none p-3 text-white"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm">
                        WhatsBotX offers bulk messaging, auto-replies, and scheduled reminders. Try /help to start! 🚀
                      </p>
                    </motion.div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary/30 flex-shrink-0" />
                </motion.div>

                {/* Message 3: User (NEW) */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="flex-1">
                    <motion.div 
                      className="bg-background rounded-2xl rounded-tl-none p-3 border border-border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm">Can I schedule them for next week?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Message 4: Bot (NEW) */}
                <motion.div 
                  className="flex gap-3 justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex-1 max-w-[80%]">
                    <motion.div 
                      className="bg-gradient-to-br from-secondary to-purple-600 rounded-2xl rounded-tr-none p-3 text-white"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm">
                        Absolutely! 🗓️ Just select the date in the dashboard and we'll handle the delivery.
                      </p>
                    </motion.div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary/30 flex-shrink-0" />
                </motion.div>

              </div>

              <div className="flex gap-2 mt-auto">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:border-primary/50 focus:outline-none transition-all"
                />
                <Button variant="hero" size="icon" className="magnetic-button">
                  <Bot className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 flex flex-col h-full"
          >
            <motion.div whileHover={{ scale: 1.02, y: -5 }} className="flex-1">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border border-glow relative overflow-hidden h-full">
                <DemoBadge variant="corner" label="Todo Demo" />
                <h3 className="text-xl font-bold mb-4">Todo & Reminders</h3>
                
                <div className="space-y-2 mb-4">
                  {[
                    { text: "Send campaign messages", done: true },
                    { text: "Review auto-reply rules", done: true },
                    { text: "Update contact database", done: false },
                    { text: "Check message analytics", done: false },
                  ].map((todo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      whileHover={{ x: 5, scale: 1.01 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        todo.done ? "bg-primary/5 border-primary/20" : "bg-background border-border"
                      }`}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded flex items-center justify-center ${
                          todo.done ? "bg-primary" : "border-2 border-muted-foreground"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {todo.done && <CheckCircle className="w-4 h-4 text-white" />}
                      </motion.div>
                      <span className={todo.done ? "line-through text-muted-foreground" : ""}>
                        {todo.text}
                      </span>
                      <Button variant="ghost" size="icon" className="ml-auto hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <Button variant="outline" className="w-full hover:bg-primary/10 mt-auto">
                  Add New Task
                </Button>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -5 }}>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border border-glow h-full">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {tools.map((tool, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                      >
                        <tool.icon className={`w-6 h-6 mx-auto mb-2 ${tool.color}`} />
                      </motion.div>
                      <span className="text-sm font-medium">{tool.label}</span>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AITools;