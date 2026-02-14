import { motion } from "framer-motion";
import { Button } from "@/components/ui/forms";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedThemeToggle } from "@/components/ui/custom";
import whatsBotXLogo from "@/assets/whatsbotx-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Download", href: "/download" },
    { label: "Documentation", href: "/documentation" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Support", href: "/support" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <motion.div 
                className="w-10 h-10 rounded-xl overflow-hidden"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(142 76% 36% / 0.3)",
                    "0 0 40px hsl(142 76% 36% / 0.5)",
                    "0 0 20px hsl(142 76% 36% / 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src={whatsBotXLogo} alt="WhatsBotX Logo" className="w-full h-full object-cover" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gradient-primary">WhatsBotX</span>
                <span className="text-xs text-muted-foreground block -mt-1">v2.1.4</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <Link key={idx} to={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Animated Theme Toggle */}
            <AnimatedThemeToggle />

            {/* GitHub Button - FIXED SYNTAX */}
            <a href="https://github.com/Rudii-25/WhatsBotX" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="sm" className="hidden sm:flex gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </Button>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-muted"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, idx) => (
              <Link key={idx} to={item.href} onClick={() => setIsOpen(false)}>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
            {/* Mobile GitHub Button - FIXED SYNTAX */}
            <Button variant="hero" size="sm" className="w-full gap-2 mt-4" asChild>
              <a href="https://github.com/Rudii-25/WhatsBotX" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;