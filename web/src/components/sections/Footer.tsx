import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-card/30 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold">WhatsBotX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete WhatsApp automation solution with AI assistant and powerful features.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#gui" className="hover:text-primary transition-colors">Desktop GUI</a></li>
              <li><a href="#commands" className="hover:text-primary transition-colors">Commands</a></li>
              <li><a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/docs/INSTALLATION.md" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="/docs/API.md" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="https://discord.gg/whatsbotx" className="hover:text-primary transition-colors">Discord Community</a></li>
              <li><a href="/support" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/Rudii-25/WhatsBotX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/rudra-sharma-714a7b259/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:rudra25trikha@gmail.com"
                className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Rudra Sharma. All rights reserved. Open source and free forever.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by Rudra Sharma
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;