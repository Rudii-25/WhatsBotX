import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Navigation, Footer } from "@/components/sections";
import { Card3D, ParticleField } from "@/components/3d";
import { Button } from "@/components/ui/forms";
import { Progress } from "@/components/ui/feedback";
import { NextStepsModal } from "@/components/ui/overlays";
import { 
  Download, Monitor, Apple, Terminal, CheckCircle2, 
  Copy, ArrowRight, Zap, Shield, Clock, 
  GitBranch, Package, Coffee, Rocket
} from "lucide-react";

const platforms = [
  { name: "Windows", icon: Monitor, desc: "Windows 10/11 (64-bit)", file: "WhatsBotX-Setup.exe", size: "85 MB", link: "https://github.com/Rudii-25/WhatsBotX" },
  { name: "macOS", icon: Apple, desc: "macOS 10.15+ (Intel & M1)", file: "WhatsBotX.dmg", size: "92 MB", link: "https://github.com/Rudii-25/WhatsBotX/blob/main/BUILD.md" },
  { name: "Linux", icon: Terminal, desc: "Ubuntu, Debian, Fedora", file: "WhatsBotX.AppImage", size: "88 MB", link: "https://github.com/Rudii-25/WhatsBotX/blob/main/BUILD.md" },
];

const steps = [
  { title: "Install Node.js 18+", cmd: "https://nodejs.org/", progress: 25 },
  { title: "Clone Repository", cmd: "git clone https://github.com/Rudii-25/WhatsBotX.git", progress: 50 },
  { title: "Install Dependencies", cmd: "npm install", progress: 75 },
  { title: "Start Application", cmd: "npm start", progress: 100 },
];

const requirements = [
  { icon: Package, title: "Node.js 18+", desc: "JavaScript runtime" },
  { icon: GitBranch, title: "Git", desc: "Version control" },
  { icon: Coffee, title: "npm/yarn", desc: "Package manager" },
  { icon: Zap, title: "WhatsApp Account", desc: "For QR code scanning" },
];

const DownloadPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [nextStepsOpen, setNextStepsOpen] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <ParticleField className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Download className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-secondary">Download</span>
              <br />
              <span className="text-foreground">WhatsBotX</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get started with WhatsBotX in minutes. Available for all major platforms.
            </p>
          </motion.div>

          {/* Platform Downloads */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {platforms.map((platform, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <platform.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{platform.desc}</p>
                    <div className="text-xs text-muted-foreground mb-4">
                      {platform.file} • {platform.size}
                    </div>
                    <a href={platform.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button variant="hero" className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Prerequisites
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {requirements.map((req, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <req.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{req.title}</h3>
                <p className="text-sm text-muted-foreground">{req.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section ref={stepsRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-muted-foreground">Follow these steps to get WhatsBotX running</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stepsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Progress value={steps[currentStep].progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {steps.map((_, idx) => (
                  <span key={idx} className={idx <= currentStep ? "text-primary" : ""}>
                    Step {idx + 1}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.15 + 0.4 }}
                  className={`glass-card rounded-xl p-6 border-2 transition-colors cursor-pointer ${
                    currentStep === idx ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setCurrentStep(idx)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      idx <= currentStep ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {idx < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                        <code className="text-sm text-primary flex-1 font-mono">{step.cmd}</code>
                        {!step.cmd.startsWith("http") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(step.cmd, idx);
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            {copied === idx ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Step Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stepsInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              {currentStep < steps.length - 1 ? (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  className="gap-2"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="hero" size="lg" className="gap-2" onClick={() => setNextStepsOpen(true)}>
                  <Rocket className="w-5 h-5" />
                  You're Ready! Next Steps
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { icon: Clock, value: "3-5 sec", label: "Startup Time" },
              { icon: Shield, value: "100%", label: "Open Source" },
              { icon: Zap, value: "<100ms", label: "Response Time" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <NextStepsModal isOpen={nextStepsOpen} onClose={() => setNextStepsOpen(false)} />
    </div>
  );
};

export default DownloadPage;
