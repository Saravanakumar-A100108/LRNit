import * as React from "react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Code, Calendar, Users, ExternalLink, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

const iconMap: Record<string, React.FC<{ className?: string }>> = { 
  Code, 
  Calendar, 
  Users 
};

const RevealSection = ({ children, className = "", index = 0 }: { children: React.ReactNode; className?: string; index?: number }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] as const } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const Programs = () => {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative overflow-hidden bg-dot-pattern"
    >
      {/* Decorative Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <Navbar />

      <section className="pt-24 md:pt-32 pb-10 md:pb-14 px-4 md:px-6 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container mx-auto text-center max-w-2xl"
        >
          <motion.span variants={fadeInUp} className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            What We Do
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Our Events
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Discover how LRNit empowers you through immersive programs designed to accelerate your tech career.
          </motion.p>
        </motion.div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16 relative z-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section className="pb-16 md:pb-24 px-4 md:px-6 relative z-10">
          <div className="container mx-auto max-w-3xl space-y-8">
            {programs.map((program, i) => {
              const Icon = iconMap[program.icon] || Code;
              return (
                <RevealSection key={program.id} index={i}>
                  <motion.div 
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="flex flex-col md:flex-row gap-5 items-start p-6 rounded-lg border border-border bg-card/50 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.15)] group glass-card"
                  >
                    {program.photo ? (
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <img src={program.photo} alt={program.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2 text-left group-hover:text-primary transition-colors">
                        {program.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-2">
                        {program.description}
                      </p>
                      <p className="text-foreground/70 leading-relaxed text-sm mb-4">
                        {program.details}
                      </p>
                      {program.enroll_link && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={program.enroll_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all"
                        >
                          Enroll Now <ExternalLink className="w-3.5 h-3.5" />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </RevealSection>
              );
            })}
          </div>
        </section>
      )}

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground relative z-10 bg-card/20 filter backdrop-blur-sm">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Programs;
