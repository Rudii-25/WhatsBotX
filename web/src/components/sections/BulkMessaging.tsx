import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/layout";
import { Button } from "@/components/ui/forms";
import { Progress } from "@/components/ui/feedback";
import { Upload, Send, CheckCircle2, XCircle, Clock } from "lucide-react";

const BulkMessaging = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const leftCardX = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const rightCardX = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const [progress, setProgress] = useState(67);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setSending(false);
        setProgress(67);
      }
    }, 200);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Scale Your Messaging
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            <span className="text-gradient-primary">
              Bulk Messaging
            </span>{" "}
            Made Easy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Send personalized messages to thousands with smart rate limiting and delivery tracking
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            style={{ x: leftCardX }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border h-full border-glow relative overflow-hidden">
              {/* Demo badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-primary/10 border border-primary/30 rounded-full">
                <span className="text-xs font-medium text-primary">Feature Preview</span>
              </div>
              <h3 className="text-2xl font-bold mb-6">Upload & Send</h3>
              
              <motion.div 
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 mb-6 hover:border-primary/50 transition-colors cursor-pointer group"
                whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary))" }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-lg font-medium mb-2">Drop your .txt file here</p>
                  <p className="text-sm text-muted-foreground">
                    One number per line, supports international formats
                  </p>
                </div>
              </motion.div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Message Template</label>
                  <textarea
                    className="w-full p-3 bg-background border border-input rounded-lg resize-none focus:border-primary/50 focus:outline-none transition-colors"
                    rows={4}
                    placeholder="Hi {name}, this is your personalized message..."
                  />
                </div>

                <Button 
                  variant="hero" 
                  className="w-full magnetic-button" 
                  size="lg"
                  onClick={handleSend}
                  disabled={sending}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {sending ? "Sending..." : "Start Bulk Messaging"}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            style={{ x: rightCardX }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border h-full border-glow relative overflow-hidden">
              {/* Demo badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-primary/10 border border-primary/30 rounded-full">
                <span className="text-xs font-medium text-primary">Live Demo</span>
              </div>
              <h3 className="text-2xl font-bold mb-6">Live Progress</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Sending Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}/100</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: CheckCircle2, value: "67", label: "Delivered", color: "text-primary", border: "border-primary/20" },
                    { icon: Clock, value: "28", label: "Pending", color: "text-muted-foreground", border: "border-border" },
                    { icon: XCircle, value: "5", label: "Failed", color: "text-destructive", border: "border-destructive/20" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`text-center p-4 bg-background rounded-lg border ${stat.border}`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { number: "+1 234 567 8901", status: "delivered", time: "2s ago" },
                    { number: "+1 234 567 8902", status: "delivered", time: "4s ago" },
                    { number: "+1 234 567 8903", status: "pending", time: "6s ago" },
                    { number: "+1 234 567 8904", status: "delivered", time: "8s ago" },
                    { number: "+1 234 567 8905", status: "failed", time: "10s ago" },
                  ].map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {msg.status === "delivered" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        {msg.status === "pending" && <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />}
                        {msg.status === "failed" && <XCircle className="w-4 h-4 text-destructive" />}
                        <span className="text-sm font-mono">{msg.number}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="p-4 bg-primary/10 border border-primary/20 rounded-lg"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 hsl(var(--primary) / 0)",
                      "0 0 20px hsl(var(--primary) / 0.2)",
                      "0 0 0 hsl(var(--primary) / 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-sm text-primary font-medium">
                    ⚡ Rate Limiting Active: 1 message per second
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BulkMessaging;
