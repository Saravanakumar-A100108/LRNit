import * as React from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

const Announcements = () => {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("date", { ascending: false });
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

      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-10"
          >
            <motion.span variants={fadeInUp} className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Latest Updates
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Announcements
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-sm">
              Stay up to date with the latest news from LRNit.
            </motion.p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16 relative z-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-muted-foreground py-16"
            >
              No announcements at this time.
            </motion.div>
          ) : (
            <div className="space-y-4 relative z-10">
              {announcements.map((a, i) => (
                <motion.article
                  key={a.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } }
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-card/50 border border-border rounded-lg p-5 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] group glass-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Megaphone className="w-4 h-4 text-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{a.title}</h2>
                      <p className="text-xs text-muted-foreground/60 mb-2">
                        {new Date(a.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{a.content}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground relative z-10 bg-card/20 filter backdrop-blur-sm">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Announcements;
