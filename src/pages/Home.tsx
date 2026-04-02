import * as React from "react";
import Navbar from "@/components/Navbar";
import GalleryCarousel from "@/components/GalleryCarousel";
import TeamMarquee from "@/components/TeamMarquee";
import ContactForm from "@/components/ContactForm";
import { Code, Calendar, Users, Mail, MapPin, Megaphone, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, Variants } from "framer-motion";

const iconMap: Record<string, React.FC<{ className?: string }>> = { 
  Code, 
  Calendar, 
  Users, 
  Mail, 
  MapPin, 
  Megaphone, 
  Instagram, 
  Linkedin, 
  ArrowRight 
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
    {children}
  </span>
);

const Home = () => {
  const { data: announcements = [] } = useQuery({
    queryKey: ["home_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: programs = [] } = useQuery({
    queryKey: ["home_programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("active", true)
        .order("sort_order")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
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
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" 
      />

      <Navbar />

      {/* Hero */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-4 md:px-6 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container mx-auto text-center max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 hover:bg-primary/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Empowering Tech Leaders
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary glow-text bg-[length:200%_auto] animate-shimmer">LRN</span><span className="text-foreground">it</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-semibold tracking-wide text-foreground/80 mb-6 font-sans">
            Learn. Build. Lead.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Empowering the next generation of tech leaders through immersive learning, real-world building, and transformative leadership.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-6 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <SectionLabel>Latest Updates</SectionLabel>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Announcements</h2>
              </div>
              <Link
                to="/announcements"
                className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <RevealSection key={a.id} index={i}>
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="flex items-start gap-4 p-5 rounded-lg border border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] group glass-card"
                  >
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Megaphone className="w-4 h-4 text-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 text-sm group-hover:text-primary transition-colors">{a.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </motion.div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionLabel>What We Do</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Events</h2>
            </div>
            <Link
              to="/programs"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {programs.map((program, i) => {
              const Icon = iconMap[program.icon] || Code;
              return (
                <RevealSection key={program.id} index={i}>
                  <Link to="/programs" className="block h-full group">
                    <motion.div 
                      whileHover={{ y: -8 }}
                      className="h-full flex flex-col items-start p-6 rounded-lg border border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.2)] glass-card"
                    >
                      {program.photo ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-500">
                          <img src={program.photo} alt={program.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                          <Icon className="w-5 h-5 text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{program.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{program.description}</p>
                      <span className="mt-4 text-xs font-medium text-primary flex items-center gap-1">
                        <span className="group-hover:mr-1 transition-all">Learn more</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.div>
                  </Link>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-t border-border">
        <RevealSection className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <SectionLabel>Moments</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Gallery</h2>
          </div>
          <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
            <GalleryCarousel />
          </motion.div>
        </RevealSection>
      </section>

      {/* Team */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-t border-border">
        <RevealSection className="container mx-auto max-w-4xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <SectionLabel>The People</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Team</h2>
            </div>
            <Link
              to="/team"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              Meet the team <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <TeamMarquee />
        </RevealSection>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-t border-border">
        <RevealSection className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <SectionLabel>Let's Connect</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Get in Touch
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center gap-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">LRNit</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Empowering the next generation of tech leaders through immersive learning, building, and leadership.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: "Block-13, Student Welfare Wing, Lovely Professional University, Punjab, India" },
                  { icon: Mail, label: "Email", value: "contact.lrnit@gmail.com", href: "mailto:contact.lrnit@gmail.com" },
                  { icon: Instagram, label: "Instagram", value: "lrnit_org", href: "https://www.instagram.com/lrnit_org?igsh=MTN3dGt4bXRzaGxoYg==" },
                  { icon: Linkedin, label: "LinkedIn", value: "LRNit", href: "https://www.linkedin.com/company/lrnitorg/" },
                ].map((item, i) => (
                  <motion.div 
                    key={item.label} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { delay: i * 0.1 } }
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-primary/20 hover:scale-110 transition-all duration-300">
                      <item.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.01 }} 
              className="bg-card/40 backdrop-blur-md rounded-xl border border-border p-6 shadow-xl hover:border-primary/20 transition-all"
            >
              <ContactForm />
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 mt-12 bg-card/20 border-t-white/10">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} LRNit. All rights reserved.</span>
          <Link
            to="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/40 hover:text-primary transition-colors text-xs"
          >
            Admin
          </Link>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
