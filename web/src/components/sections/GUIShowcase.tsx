import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, Send, Bot, Wrench, Settings, FileText, Users, Clock, CheckCircle, AlertTriangle, Cpu, Database, Bell, Shield, Activity } from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bulk", label: "Bulk Messaging", icon: Send },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logs", label: "Logs", icon: FileText },
];

// Unique content for each tab
const tabContent = {
  dashboard: {
    title: "System Overview",
    description: "Real-time monitoring of your WhatsApp automation",
    stats: [
      { value: "1,247", label: "Messages Today", color: "primary" },
      { value: "342", label: "Active Contacts", color: "secondary" },
      { value: "99.9%", label: "Uptime", color: "primary" },
    ],
    features: [
      { icon: Activity, label: "Live Activity Feed", status: "active" },
      { icon: Users, label: "Contact Sync", status: "synced" },
      { icon: Bell, label: "Notifications", status: "3 new" },
    ],
  },
  bulk: {
    title: "Bulk Messaging Center",
    description: "Send messages to multiple contacts efficiently",
    stats: [
      { value: "5,000+", label: "Messages Queued", color: "secondary" },
      { value: "1/sec", label: "Send Rate", color: "primary" },
      { value: "98.5%", label: "Delivery Rate", color: "primary" },
    ],
    features: [
      { icon: Send, label: "Message Queue", status: "running" },
      { icon: Clock, label: "Scheduled", status: "12 pending" },
      { icon: CheckCircle, label: "Delivered", status: "4,891" },
    ],
  },
  ai: {
    title: "AI Assistant Hub",
    description: "Intelligent automation powered by AI",
    stats: [
      { value: "892", label: "AI Responses", color: "primary" },
      { value: "4.8s", label: "Avg Response", color: "secondary" },
      { value: "95%", label: "Accuracy", color: "primary" },
    ],
    features: [
      { icon: Bot, label: "Auto-Reply", status: "enabled" },
      { icon: Cpu, label: "Processing", status: "idle" },
      { icon: Database, label: "Knowledge Base", status: "synced" },
    ],
  },
  tools: {
    title: "Automation Tools",
    description: "Powerful utilities for advanced automation",
    stats: [
      { value: "41+", label: "Available Commands", color: "secondary" },
      { value: "15", label: "Active Macros", color: "primary" },
      { value: "8", label: "Custom Scripts", color: "primary" },
    ],
    features: [
      { icon: Wrench, label: "Command Builder", status: "ready" },
      { icon: Clock, label: "Task Scheduler", status: "3 active" },
      { icon: Activity, label: "Workflow Engine", status: "running" },
    ],
  },
  settings: {
    title: "Configuration",
    description: "Customize your WhatsBotX experience",
    stats: [
      { value: "Pro", label: "License Type", color: "primary" },
      { value: "v1.0.5", label: "Version", color: "secondary" },
      { value: "Secure", label: "Connection", color: "primary" },
    ],
    features: [
      { icon: Shield, label: "Security", status: "enabled" },
      { icon: Bell, label: "Notifications", status: "on" },
      { icon: Database, label: "Backup", status: "daily" },
    ],
  },
  logs: {
    title: "Activity Logs",
    description: "Detailed history of all operations",
    stats: [
      { value: "12,459", label: "Total Events", color: "secondary" },
      { value: "0", label: "Errors Today", color: "primary" },
      { value: "3", label: "Warnings", color: "primary" },
    ],
    features: [
      { icon: FileText, label: "Event Log", status: "recording" },
      { icon: AlertTriangle, label: "Error Log", status: "clean" },
      { icon: Activity, label: "Performance", status: "optimal" },
    ],
  },
};

const GUIShowcase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section id="gui-showcase" className="py-24 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Professional Interface
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Powerful{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Electron GUI
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beautiful desktop application with intuitive interface and real-time controls
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-6 md:p-8 bg-background/50 backdrop-blur-xl border-border relative overflow-hidden">
            <DemoBadge variant="corner" label="Interactive Demo" />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 h-auto gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden md:inline text-xs lg:text-sm">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-0"
                >
                  <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-card/80 backdrop-blur-sm">
                    {/* Simulated GUI Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <motion.span 
                          key={`title-${activeTab}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-sm font-medium text-muted-foreground"
                        >
                          WhatsBotX - {currentContent.title}
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-primary">Connected</span>
                      </div>
                    </div>

                    {/* Tab-specific content */}
                    <div className="p-6">
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-foreground mb-2">{currentContent.title}</h3>
                        <p className="text-muted-foreground">{currentContent.description}</p>
                      </motion.div>

                      {/* Feature cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {currentContent.features.map((feature, idx) => (
                          <motion.div
                            key={`${activeTab}-feature-${idx}`}
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.08, duration: 0.35 }}
                            className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{feature.label}</div>
                              <div className="text-xs text-muted-foreground">{feature.status}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats below */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {currentContent.stats.map((stat, idx) => (
                      <motion.div 
                        key={`${activeTab}-stat-${idx}`}
                        whileHover={{ scale: 1.05, y: -5 }}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.35 + idx * 0.1, duration: 0.4 }}
                      >
                        <Card className={`p-4 bg-card/50 backdrop-blur-sm border-${stat.color}/20 transition-all hover:shadow-lg hover:shadow-${stat.color}/20`}>
                          <div className={`text-2xl md:text-3xl font-bold text-${stat.color} mb-1`}>
                            {stat.value}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default GUIShowcase;