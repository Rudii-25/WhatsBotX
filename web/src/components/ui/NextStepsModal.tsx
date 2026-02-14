import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/forms";

interface NextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NextStepsModal = ({ isOpen, onClose }: NextStepsModalProps) => {
  const steps = [
    {
      number: 1,
      title: "Download & Extract",
      description: "Download the installer for your OS and extract/run it",
      details: "Windows: Run .exe | macOS: Open .dmg | Linux: Run .AppImage"
    },
    {
      number: 2,
      title: "Install Dependencies",
      description: "Open terminal and install Node.js dependencies",
      code: "npm install"
    },
    {
      number: 3,
      title: "Connect WhatsApp",
      description: "Scan the QR code with your WhatsApp mobile app",
      details: "Go to Settings > Linked Devices > Link a Device"
    },
    {
      number: 4,
      title: "Start Using",
      description: "Access all 41+ commands and features",
      details: "Check the /help command for available commands"
    },
    {
      number: 5,
      title: "Configure (Optional)",
      description: "Set up AI, database, and other features",
      details: "Edit .env file with your API keys and preferences"
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm">
                <div>
                  <h2 className="text-2xl font-bold">Getting Started with WhatsBotX</h2>
                  <p className="text-sm text-muted-foreground mt-1">5 easy steps to get up and running</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 pb-6 border-b border-border/50 last:border-0"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.1, type: "spring" }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
                        >
                          {step.number}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        {step.code && (
                          <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm border border-border/50 overflow-x-auto">
                            <code>{step.code}</code>
                          </div>
                        )}
                        {step.details && (
                          <p className="text-sm text-muted-foreground mt-2 italic">{step.details}</p>
                        )}
                      </div>

                      {/* Checkmark */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Resources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl"
                >
                  <h4 className="font-semibold mb-3">Need Help?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>📖 Check the <a href="/documentation" className="text-primary hover:underline">Documentation</a></li>
                    <li>❓ See the <a href="/support" className="text-primary hover:underline">FAQ</a> section</li>
                    <li>💬 Join our <a href="https://discord.gg/whatsbotx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord Community</a></li>
                    <li>🐛 Report issues on <a href="https://github.com/Rudii-25/WhatsBotX/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a></li>
                  </ul>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 flex justify-between gap-3 sticky bottom-0 bg-card/95 backdrop-blur-sm">
                <div className="text-sm text-muted-foreground">
                  💡 Estimated setup time: 5-10 minutes
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="hero" asChild>
                    <a href="https://github.com/Rudii-25/WhatsBotX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      View on GitHub
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NextStepsModal;
