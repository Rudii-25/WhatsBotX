import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navigation, Footer } from "@/components/sections";
import { Card3D, ParticleField } from "@/components/3d";
import { 
  MessageSquare, Bot, Zap, Shield, Settings, Database, 
  Smartphone, Cloud, Lock, Users, Bell, Globe, 
  Code, Terminal, Cpu, HardDrive
} from "lucide-react";

const features = [
  {
    category: "WhatsApp Bot",
    icon: MessageSquare,
    color: "primary",
    items: [
      { title: "QR Code Integration", desc: "Seamless WhatsApp Web connection with auto-reconnect", icon: Smartphone },
      { title: "41+ Commands", desc: "Rich command set for automation", icon: Terminal },
      { title: "Multi-User Support", desc: "Database-backed user management", icon: Users },
      { title: "Smart Auto-Reply", desc: "Intelligent message handling", icon: Bot },
    ]
  },
  {
    category: "Professional GUI",
    icon: Settings,
    color: "secondary",
    items: [
      { title: "Real-time Dashboard", desc: "Live stats and monitoring", icon: Cpu },
      { title: "Bulk Messaging", desc: "Send to thousands efficiently", icon: Zap },
      { title: "Message Logs", desc: "Complete message history", icon: Database },
      { title: "Settings Panel", desc: "Customize every aspect", icon: Settings },
    ]
  },
  {
    category: "AI Assistant",
    icon: Bot,
    color: "primary",
    items: [
      { title: "Natural Language", desc: "Chat naturally with AI", icon: MessageSquare },
      { title: "Context Aware", desc: "Remembers conversation context", icon: Cloud },
      { title: "Multi-Language", desc: "Supports multiple languages", icon: Globe },
      { title: "Quick Actions", desc: "Jokes, quotes, weather & more", icon: Zap },
    ]
  },
  {
    category: "Productivity Tools",
    icon: Zap,
    color: "secondary",
    items: [
      { title: "Todo Management", desc: "Create, complete, delete tasks", icon: Bell },
      { title: "Reminders", desc: "Never forget important tasks", icon: Bell },
      { title: "Notes", desc: "Quick note-taking feature", icon: Database },
      { title: "Scheduler", desc: "Schedule messages in advance", icon: Cloud },
    ]
  },
  {
    category: "API & Integration",
    icon: Code,
    color: "primary",
    items: [
      { title: "REST API", desc: "Full API access for developers", icon: Code },
      { title: "Webhooks", desc: "Real-time event notifications", icon: Cloud },
      { title: "Custom Commands", desc: "Create your own commands", icon: Terminal },
      { title: "Plugin System", desc: "Extend functionality easily", icon: Cpu },
    ]
  },
  {
    category: "Security & Storage",
    icon: Shield,
    color: "secondary",
    items: [
      { title: "Encrypted Storage", desc: "Secure data handling", icon: Lock },
      { title: "SQLite Database", desc: "Reliable local storage", icon: HardDrive },
      { title: "Session Management", desc: "Secure session handling", icon: Shield },
      { title: "Rate Limiting", desc: "Protection against abuse", icon: Shield },
    ]
  },
];

const FeaturesPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <ParticleField className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Powerful Features</span>
              <br />
              <span className="text-foreground">Built for Automation</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to automate WhatsApp messaging at scale.
              From AI assistant to bulk messaging, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      {features.map((category, catIdx) => (
        <FeatureCategory key={catIdx} {...category} index={catIdx} />
      ))}

      <Footer />
    </div>
  );
};

interface FeatureCategoryProps {
  category: string;
  icon: React.ElementType;
  color: string;
  items: Array<{ title: string; desc: string; icon: React.ElementType }>;
  index: number;
}

const FeatureCategory = ({ category, icon: CategoryIcon, color, items, index }: FeatureCategoryProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isEven = index % 2 === 0;

  return (
    <section className={`py-20 ${isEven ? "bg-muted/20" : ""}`}>
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            color === "primary" ? "bg-primary/20" : "bg-secondary/20"
          }`}>
            <CategoryIcon className={`w-7 h-7 ${color === "primary" ? "text-primary" : "text-secondary"}`} />
          </div>
          <h2 className="text-3xl font-bold">{category}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card3D glowColor={color === "primary" ? "hsl(142 76% 36%)" : "hsl(217 91% 60%)"}>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    color === "primary" ? "bg-primary/20" : "bg-secondary/20"
                  }`}>
                    <item.icon className={`w-6 h-6 ${color === "primary" ? "text-primary" : "text-secondary"}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesPage;
