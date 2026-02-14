import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Navigation, Footer } from "@/components/sections";
import { ParticleField, Card3D } from "@/components/3d";
import { LicenseModal } from "@/components/ui/overlays";
import useGitHubStats from "@/hooks/useGitHubStats";
import { 
  Users, Heart, Code, Star, GitBranch, GitMerge,
  Award, Rocket, Calendar, Coffee, Github, Linkedin,
  Mail, Globe, Shield
} from "lucide-react";
import { Button } from "@/components/ui/forms";

const timeline = [
  { date: "Nov 2025", title: "Project Kickoff", desc: "Initial concept, architecture design, and team setup" },
  { date: "Nov 2025", title: "Core Development", desc: "WhatsApp Web integration and authentication system" },
  { date: "Dec 2025", title: "Desktop GUI", desc: "Electron-based professional interface development" },
  { date: "Dec 2025", title: "Bot Features", desc: "41+ command implementation and testing" },
  { date: "Jan 2026", title: "AI Integration", desc: "Added OpenAI assistant and smart responses" },
  { date: "Feb 2026", title: "v2.0 Launch", desc: "Official release with bulk messaging and advanced features" },
];

const team = [
  {
    name: "Rudra Sharma",
    role: "Lead Developer & Project Founder",
    bio: "Full-stack developer passionate about automation and open source",
    links: { github: "https://github.com/Rudii-25", linkedin: "https://www.linkedin.com/in/rudra-sharma-714a7b259/", email: "mailto:rudra25trikha@gmail.com" }
  },
];

const stats = [
  { icon: Star, value: "1000+", label: "GitHub Stars" },
  { icon: GitBranch, value: "50+", label: "Contributors" },
  { icon: GitMerge, value: "200+", label: "Pull Requests" },
  { icon: Code, value: "15K+", label: "Lines of Code" },
];

const values = [
  { icon: Heart, title: "Open Source", desc: "Free and open for everyone" },
  { icon: Shield, title: "Privacy First", desc: "Your data stays with you" },
  { icon: Users, title: "Community Driven", desc: "Built by the community" },
  { icon: Rocket, title: "Innovation", desc: "Always pushing boundaries" },
];

const AboutPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [licenseOpen, setLicenseOpen] = useState(false);
  const stats = useGitHubStats();

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
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">About</span>
              <br />
              <span className="text-foreground">WhatsBotX</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The complete WhatsApp automation solution built by developers, for developers.
              Open source, free forever, and constantly evolving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            ref={statsRef}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-gradient-primary mb-1">
                {stats.loading ? "..." : `${stats.stars.toLocaleString()}+`}
              </div>
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <GitBranch className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-gradient-primary mb-1">
                {stats.loading ? "..." : stats.contributors}
              </div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <GitMerge className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-gradient-primary mb-1">
                {stats.loading ? "..." : `${stats.pullRequests}+`}
              </div>
              <div className="text-sm text-muted-foreground">Pull Requests</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <Code className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-gradient-primary mb-1">
                {stats.loading ? "..." : `${(stats.linesOfCode / 1000).toFixed(1)}K+`}
              </div>
              <div className="text-sm text-muted-foreground">Lines of Code</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">What drives us every day</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={timelineInView ? { opacity: 1 } : {}}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Development Timeline</h2>
            <p className="text-muted-foreground">Our journey so far</p>
          </motion.div>

          <div className="max-w-3xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.2 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? "text-right" : "text-left"}`}>
                  <div className="glass-card rounded-xl p-6 inline-block">
                    <span className="text-xs text-primary font-semibold">{item.date}</span>
                    <h3 className="font-bold text-lg mt-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="w-4 h-4 bg-primary rounded-full border-4 border-background z-10 flex-shrink-0" />
                
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground">The people behind WhatsBotX</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 flex items-center gap-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                      <div className="flex gap-2">
                        {member.links.github && (
                          <a href={member.links.github} className="p-2 bg-muted rounded-lg hover:bg-primary/20 transition-colors">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {member.links.linkedin && (
                          <a href={member.links.linkedin} className="p-2 bg-muted rounded-lg hover:bg-primary/20 transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.links.email && (
                          <a href={member.links.email} className="p-2 bg-muted rounded-lg hover:bg-primary/20 transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* License */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 max-w-2xl mx-auto text-center"
          >
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">MIT License</h2>
            <p className="text-muted-foreground mb-6">
              WhatsBotX is open source software licensed under the MIT License.
              You're free to use, modify, and distribute it.
            </p>
            <Button 
              variant="outline"
              onClick={() => setLicenseOpen(true)}
              className="inline-flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              View License
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LicenseModal isOpen={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </div>
  );
};

export default AboutPage;
