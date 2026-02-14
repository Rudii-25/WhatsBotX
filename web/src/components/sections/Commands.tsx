import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/layout";
import {
  HelpCircle,
  Bot,
  Laugh,
  CheckSquare,
  Bell,
  Cloud,
  Languages,
  QrCode,
  MessageSquare,
  Activity,
  Calendar,
  Users,
  Music,
  BookOpen,
  Image as ImageIcon,
  Calculator,
  Search,
  Sparkles,
  Code,
} from "lucide-react";
import { useRef } from "react";
import { DemoBadge } from "@/components/ui/custom";

const commands = [
  { cmd: "/help", desc: "Show all available commands", icon: HelpCircle, color: "from-blue-500 to-cyan-500" },
  { cmd: "/ai", desc: "Ask AI assistant anything", icon: Bot, color: "from-primary to-emerald-500" },
  { cmd: "/joke", desc: "Get a random joke", icon: Laugh, color: "from-yellow-500 to-orange-500" },
  { cmd: "/todo", desc: "Manage your todo list", icon: CheckSquare, color: "from-purple-500 to-pink-500" },
  { cmd: "/reminder", desc: "Set reminders", icon: Bell, color: "from-red-500 to-pink-500" },
  { cmd: "/weather", desc: "Check weather forecast", icon: Cloud, color: "from-cyan-500 to-blue-500" },
  { cmd: "/translate", desc: "Translate text", icon: Languages, color: "from-green-500 to-teal-500" },
  { cmd: "/qr", desc: "Generate QR codes", icon: QrCode, color: "from-gray-500 to-slate-500" },
  { cmd: "/autoreply", desc: "Auto-reply management", icon: MessageSquare, color: "from-indigo-500 to-purple-500" },
  { cmd: "/status", desc: "Bot status & health", icon: Activity, color: "from-green-500 to-emerald-500" },
  { cmd: "/schedule", desc: "Schedule messages", icon: Calendar, color: "from-orange-500 to-red-500" },
  { cmd: "/group", desc: "Group management", icon: Users, color: "from-blue-500 to-indigo-500" },
  { cmd: "/music", desc: "Music & audio info", icon: Music, color: "from-pink-500 to-rose-500" },
  { cmd: "/quote", desc: "Inspirational quotes", icon: BookOpen, color: "from-amber-500 to-orange-500" },
  { cmd: "/image", desc: "Image processing", icon: ImageIcon, color: "from-purple-500 to-violet-500" },
  { cmd: "/calc", desc: "Quick calculator", icon: Calculator, color: "from-teal-500 to-cyan-500" },
  { cmd: "/search", desc: "Web search", icon: Search, color: "from-blue-500 to-sky-500" },
  { cmd: "/meme", desc: "Random meme generator", icon: Sparkles, color: "from-fuchsia-500 to-pink-500" },
  { cmd: "/code", desc: "Code snippets", icon: Code, color: "from-slate-500 to-gray-500" },
];

const Commands = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const gridY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="py-24 bg-card/30 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-5 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-5 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
        animate={{ y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <DemoBadge variant="default" label="Command Preview" />
          <div className="mt-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Command Library
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            41+{" "}
            <span className="text-gradient-primary">
              Powerful Commands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive command suite for every automation need
          </p>
        </motion.div>

        <motion.div 
          style={{ y: gridY }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
        >
          {commands.map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              whileHover={{ 
                scale: 1.08,
                y: -8,
                rotateY: 5,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.98 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer border-glow">
                <div className="flex items-start gap-3">
                  <motion.div 
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${command.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <command.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono font-semibold text-primary group-hover:text-foreground transition-colors">
                      {command.cmd}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {command.desc}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="inline-block p-6 bg-gradient-to-r from-primary to-emerald-500 border-glow">
              <p className="text-white font-medium">
                💡 Type <code className="px-2 py-1 bg-white/20 rounded">/help</code> in WhatsApp to see all commands
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Commands;
