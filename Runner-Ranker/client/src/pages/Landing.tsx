import { motion } from "framer-motion";
import { ArrowRight, Trophy, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black text-white p-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Hero Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center"
      >
        <motion.div variants={item} className="mb-6 flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-xs font-bold uppercase tracking-widest">
            Early Access
          </span>
        </motion.div>

        <motion.h1 
          variants={item}
          className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase mb-2 neon-text"
        >
          INT<span className="text-white">VL</span>
        </motion.h1>

        <motion.p 
          variants={item}
          className="text-xl md:text-3xl font-bold text-zinc-400 mb-8 max-w-2xl mx-auto tracking-tight"
        >
          Run hard. Earn points. <span className="text-secondary neon-text-blue">Conquer the Leaderboard.</span>
        </motion.p>

        <motion.div variants={item}>
          <Button 
            size="lg"
            className="h-16 px-10 rounded-full text-xl font-bold bg-primary text-black hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Running <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </motion.div>

        <motion.div 
          variants={item}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left"
        >
          {[
            { icon: Zap, title: "High Intensity", desc: "Interval training focus", color: "text-primary" },
            { icon: Globe, title: "Global Rank", desc: "Compete worldwide", color: "text-secondary" },
            { icon: Trophy, title: "Earn Badges", desc: "Unlock achievements", color: "text-accent" },
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-zinc-800/50 transition-colors">
              <feature.icon className={`w-8 h-8 mb-4 ${feature.color}`} />
              <h3 className="text-xl font-bold uppercase italic mb-1">{feature.title}</h3>
              <p className="text-zinc-500 font-medium">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Decorative footer */}
      <div className="absolute bottom-6 text-zinc-600 text-xs font-mono uppercase tracking-widest">
        v1.0.0 • EST. 2024
      </div>
    </div>
  );
}
