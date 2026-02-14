import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Navigation, Footer } from "@/components/sections";
import { ParticleField, Card3D } from "@/components/3d";
import { Button } from "@/components/ui/forms";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/layout";
import { 
  HelpCircle, MessageSquare, Github, Mail, 
  Send, ChevronDown, ExternalLink, Book, 
  AlertTriangle, CheckCircle2, Loader2
} from "lucide-react";

const faqs = [
  {
    question: "How do I connect to WhatsApp?",
    answer: "Simply scan the QR code displayed in the application using WhatsApp on your phone. Go to WhatsApp > Settings > Linked Devices > Link a Device, then scan the QR code shown in WhatsBotX."
  },
  {
    question: "Is WhatsBotX free to use?",
    answer: "Yes! WhatsBotX is completely free and open source under the MIT License. You can use it for personal or commercial purposes without any cost."
  },
  {
    question: "What happens if I get disconnected?",
    answer: "WhatsBotX has auto-reconnect functionality. If your connection drops, it will automatically attempt to reconnect. You can also manually reconnect from the dashboard."
  },
  {
    question: "How many messages can I send per day?",
    answer: "WhatsBotX implements rate limiting (1 message per second) to comply with WhatsApp's terms. There's no daily limit set by WhatsBotX, but WhatsApp may impose their own restrictions."
  },
  {
    question: "Can I use multiple WhatsApp accounts?",
    answer: "Currently, WhatsBotX supports one WhatsApp account per instance. For multiple accounts, you can run separate instances of the application."
  },
  {
    question: "Is my data stored securely?",
    answer: "All data is stored locally on your machine using SQLite. No data is sent to external servers. Your messages and contacts remain private."
  },
  {
    question: "How do I create custom commands?",
    answer: "Check our Developer Guide for instructions on creating custom commands. You can extend the bot with your own functionality using our plugin system."
  },
  {
    question: "Does it work on all platforms?",
    answer: "Yes! WhatsBotX is built with Electron and works on Windows (10/11), macOS (10.15+), and Linux (Ubuntu, Debian, Fedora)."
  },
];

const contactOptions = [
  {
    icon: Github,
    title: "GitHub Issues",
    desc: "Report bugs or request features",
    link: "https://github.com/Rudii-25/WhatsBotX/issues",
    color: "primary"
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "rudra25trikha@gmail.com",
    link: "mailto:rudra25trikha@gmail.com",
    color: "primary"
  },
];

const SupportPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const emailData = {
        to: "rudra25trikha@gmail.com",
        from: formData.email,
        subject: `WhatsBotX Support: ${formData.subject}`,
        name: formData.name,
        message: formData.message,
        timestamp: new Date().toISOString()
      };

      console.log("Support message received:", emailData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <section className="relative pt-32 pb-20 overflow-hidden">
        <ParticleField className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-background" />
        
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
              <HelpCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-secondary">Support</span>
              <br />
              <span className="text-foreground">& Help Center</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get help with WhatsBotX. Browse FAQs, contact us, or join our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactOptions.map((option, idx) => (
              <motion.a
                key={idx}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card3D glowColor={option.color === "primary" ? "hsl(142 76% 36%)" : "hsl(217 91% 60%)"}>
                  <div className="p-6 text-center group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      option.color === "primary" ? "bg-primary/20" : "bg-secondary/20"
                    }`}>
                      <option.icon className={`w-7 h-7 ${
                        option.color === "primary" ? "text-primary" : "text-secondary"
                      }`} />
                    </div>
                    <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                      {option.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </Card3D>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find quick answers to common questions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="glass-card rounded-xl border-none px-6"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">Can't find what you're looking for? Send us a message.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <Card3D>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting || submitted}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card3D>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/documentation" className="flex items-center gap-2 px-6 py-3 bg-background rounded-xl hover:bg-muted transition-colors">
              <Book className="w-5 h-5 text-primary" />
              <span>Documentation</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-background rounded-xl hover:bg-muted transition-colors">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Report a Bug</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-background rounded-xl hover:bg-muted transition-colors">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupportPage;
