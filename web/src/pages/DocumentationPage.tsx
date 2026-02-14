import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Navigation, Footer } from "@/components/sections";
import { Card3D, ParticleField } from "@/components/3d";
import { MarkdownModal } from "@/components/ui/overlays";
import useMarkdownContent from "@/hooks/useMarkdownContent";
import { 
  Book, Code, FileText, HelpCircle, Users, Wrench,
  ChevronRight, Search, Terminal, Zap, MessageSquare,
  ArrowRight, ExternalLink, Copy, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/forms";

const docSections = [
  { icon: Book, title: "User Manual", desc: "Complete guide for using WhatsBotX", color: "primary" },
  { icon: Code, title: "API Reference", desc: "REST API documentation", color: "secondary" },
  { icon: FileText, title: "Developer Guide", desc: "Build custom commands & plugins", color: "primary" },
  { icon: HelpCircle, title: "FAQ", desc: "Frequently asked questions", color: "secondary" },
  { icon: Wrench, title: "Troubleshooting", desc: "Common issues & solutions", color: "primary" },
  { icon: Users, title: "Contributing", desc: "How to contribute to WhatsBotX", color: "secondary" },
];

const apiEndpoints = [
  { method: "POST", endpoint: "/api/send-message", desc: "Send a single message" },
  { method: "POST", endpoint: "/api/send-bulk", desc: "Send bulk messages" },
  { method: "GET", endpoint: "/api/status", desc: "Get connection status" },
  { method: "GET", endpoint: "/api/messages", desc: "Get message history" },
  { method: "POST", endpoint: "/api/command", desc: "Execute a command" },
  { method: "DELETE", endpoint: "/api/session", desc: "Logout session" },
];

const codeExample = `// Send a message via API
const response = await fetch('/api/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+1234567890',
    message: 'Hello from WhatsBotX!'
  })
});

const result = await response.json();
console.log(result); // { success: true, messageId: '...' }`;

const DocumentationPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const markdown = useMarkdownContent(selectedDoc || "");

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Markdown Modal */}
      <MarkdownModal
        isOpen={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc || ""}
        content={markdown.content}
        loading={markdown.loading}
        error={markdown.error}
      />
      
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
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Book className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to master WhatsBotX
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
              />
            </motion.div>
          </motion.div>

          {/* Doc Sections Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {docSections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                onClick={() => setSelectedDoc(section.title)}
              >
                <Card3D glowColor={section.color === "primary" ? "hsl(142 76% 36%)" : "hsl(217 91% 60%)"}>
                  <div className="p-6 group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        section.color === "primary" ? "bg-primary/20" : "bg-secondary/20"
                      }`}>
                        <section.icon className={`w-6 h-6 ${
                          section.color === "primary" ? "text-primary" : "text-secondary"
                        }`} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference Preview */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">API Endpoints</h2>
            <p className="text-muted-foreground">RESTful API for developers</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Endpoints List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {apiEndpoints.map((endpoint, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group"
                >
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    endpoint.method === "GET" 
                      ? "bg-green-500/20 text-green-400" 
                      : endpoint.method === "POST"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-primary flex-1">{endpoint.endpoint}</code>
                  <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.desc}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>

            {/* Code Example */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Example: Send Message</span>
                </div>
                <button
                  onClick={copyCode}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-muted-foreground">
                  {codeExample.split('\n').map((line, i) => (
                    <div key={i} className="hover:bg-muted/50 px-2 -mx-2">
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.a
                href="/download"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Quick Start</h3>
                <p className="text-sm text-muted-foreground">Get up and running in 5 minutes</p>
              </motion.a>
              <motion.a
                href="/documentation"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <MessageSquare className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-secondary transition-colors">Commands List</h3>
                <p className="text-sm text-muted-foreground">All 41+ available commands</p>
              </motion.a>
              <motion.a
                href="https://github.com/Rudii-25/WhatsBotX"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <ExternalLink className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">GitHub</h3>
                <p className="text-sm text-muted-foreground">View source code</p>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DocumentationPage;
