import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import {
  Building2,
  MessageCircle,
  Target,
  BellRing,
  ShoppingCart,
  Users,
  Bot,
  ListTodo,
  Heart,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

const useCases = [
  {
    category: "Business Applications",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    cases: [
      { icon: MessageCircle, title: "Marketing Campaigns", desc: "Send bulk promotional messages" },
      { icon: Target, title: "Customer Support", desc: "Auto-reply to common queries" },
      { icon: Users, title: "Lead Management", desc: "Track and nurture leads" },
      { icon: BellRing, title: "Reminders", desc: "Appointment notifications" },
      { icon: ShoppingCart, title: "Order Updates", desc: "Real-time order tracking" },
    ],
  },
  {
    category: "Personal Use",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    cases: [
      { icon: Bot, title: "AI Assistant", desc: "24/7 personal assistant" },
      { icon: ListTodo, title: "Task Management", desc: "Organize todos and reminders" },
      { icon: Users, title: "Group Management", desc: "Family/friends coordination" },
      { icon: Sparkles, title: "Entertainment", desc: "Jokes, quotes, memes" },
      { icon: MessageCircle, title: "Automation", desc: "Auto-replies for busy times" },
    ],
  },
];

const UseCases = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <motion.div 
        style={{ rotate: backgroundRotate }}
        className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" 
      />
      
      {/* Floating decorations */}
      <motion.div
        className="absolute top-1/3 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Real-World Applications
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Built for{" "}
            <span className="text-gradient-secondary">
              Every Use Case
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From business automation to personal productivity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: catIdx * 0.2 }}
              style={{ y: catIdx === 0 ? leftColumnY : rightColumnY }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border h-full border-glow">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">{category.category}</h3>
                </div>

                <div className="space-y-3">
                  {category.cases.map((useCase, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: catIdx * 0.2 + idx * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group"
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <useCase.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {useCase.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
