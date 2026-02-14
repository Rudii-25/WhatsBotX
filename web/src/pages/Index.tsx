import { Navigation, Hero, Features, GUIShowcase, BulkMessaging, AITools, Architecture, Commands, UseCases, Performance, CTA, Footer } from "@/components/sections";
import { FloatingDemoButton } from "@/components/ui/custom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Features />
      <GUIShowcase />
      <BulkMessaging />
      <AITools />
      <Architecture />
      <Commands />
      <UseCases />
      <Performance />
      <CTA />
      <Footer />
      <FloatingDemoButton />
    </div>
  );
};

export default Index;
