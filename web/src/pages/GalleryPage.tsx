import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Navigation, Footer } from "@/components/sections";
import { ParticleField } from "@/components/3d";
import { X, ChevronLeft, ChevronRight, Image, Maximize2 } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Dashboard Overview",
    category: "GUI",
    image: "/Dashboard.png",
    desc: "Real-time dashboard with live statistics"
  },
  {
    id: 2,
    title: "Bulk Messaging",
    category: "Features",
    image: "/Bulk_Messaging.png",
    desc: "Send messages to thousands efficiently"
  },
  {
    id: 3,
    title: "AI Chat Interface",
    category: "AI",
    image: "/AI_Assistance.png",
    desc: "Natural language AI assistant"
  },
  {
    id: 4,
    title: "Message Logs",
    category: "GUI",
    image: "/Message_Logs.png",
    desc: "Complete message history and analytics"
  },
  {
    id: 5,
    title: "Settings Panel",
    category: "GUI",
    image: "/Settings_Panel.png",
    desc: "Customize every aspect of WhatsBotX"
  },
  {
    id: 6,
    title: "QR Code Login",
    category: "Features",
    image: "/QR_Code.png",
    desc: "Seamless WhatsApp Web connection"
  },
  {
    id: 7,
    title: "Productivity Tools",
    category: "Tools",
    image: "/Productivity_Tools.png",
    desc: "Todo, reminders, and more"
  },
  {
    id: 8,
    title: "API Dashboard",
    category: "Developer",
    image: "/API_Dashboard.png",
    desc: "Monitor API usage and endpoints"
  },
  {
    id: 9,
    title: "Statistics Overview",
    category: "Developer",
    image: "/Statistics.png",
    desc: "In-depth analytics for developers"
  },{
    id: 10,
    title: "API Keys Management",
    category: "Developer",
    image: "/API_Keys.png",
    desc: "Manage and monitor API keys securely"
  },
  {
    id: 11,
    title: "Bulk Import",
    category: "Features",
    image: "/Bulk_Import.png",
    desc: "Import contacts and messages in bulk"
  },
];

const categories = ["All", "GUI", "Features", "AI", "Tools", "Developer"];

const GalleryPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    if (lightboxImage !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const currentIndex = lightboxImage !== null 
    ? filteredItems.findIndex(item => item.id === lightboxImage)
    : -1;

  const navigateLightbox = (direction: "prev" | "next") => {
    if (currentIndex === -1) return;
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    setLightboxImage(filteredItems[newIndex].id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
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
              <Image className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-secondary">Screenshot</span>
              <br />
              <span className="text-foreground">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore WhatsBotX's beautiful interface and powerful features
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-muted"
                  onClick={() => setLightboxImage(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full mb-2 inline-block">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
              className="absolute left-6 p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
              className="absolute right-6 p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl w-full h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const item = galleryItems.find(i => i.id === lightboxImage);
                if (!item) return null;
                return (
                  <>
                    <div className="relative flex-1 rounded-xl shadow-2xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center flex-shrink-0">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full mb-2 inline-block">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;
