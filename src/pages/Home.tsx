import Navbar from "@/components/Navbar";
import GalleryCarousel from "@/components/GalleryCarousel";
import TeamMarquee from "@/components/TeamMarquee";
import ContactForm from "@/components/ContactForm";
import { Code, Calendar, Users, Mail, MapPin, Megaphone, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.FC<{ className?: string }>> = { Code, Calendar, Users };

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-scroll-reveal");
          el.classList.remove("opacity-0");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const RevealSection = ({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) => {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`opacity-0 ${className} ${delay}`}>
      {children}
    </div>
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
    <div className="min-h-screen animate-page-enter relative overflow-hidden bg-dot-pattern">
      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute top-[40%] -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] animate-blob [animation-delay:4s] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-4 md:px-6 relative z-10">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in hover:bg-primary/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Empowering Tech Leaders
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-title-drop">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary glow-text bg-[length:200%_auto] animate-shimmer">LRN</span><span className="text-foreground">it</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold tracking-wide text-foreground/80 mb-6 animate-subtitle-rise font-sans">
            Learn. Build. Lead.
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed animate-subtitle-rise">
            Empowering the next generation of tech leaders through immersive learning, real-world building, and transformative leadership.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 animate-button-fade">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all active:scale-95"
            >
              Explore Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
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
                <RevealSection key={a.id} delay={`stagger-${(i % 6) + 1}`}>
                  <div className="flex items-start gap-4 p-5 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:scale-[1.01] hover:border-primary/20 group glass-card">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Megaphone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 text-sm group-hover:text-primary transition-colors">{a.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
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
                <RevealSection key={program.id} delay={`stagger-${(i % 6) + 1}`}>
                  <Link to="/programs" className="block h-full group">
                    <div className="h-full flex flex-col items-start p-6 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:scale-[1.02] hover:border-primary/30 glass-card">
                      {program.photo ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                          <img src={program.photo} alt={program.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{program.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{program.description}</p>
                      <span className="mt-4 text-xs font-medium text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
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
          <GalleryCarousel />
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
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
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
    </div>
  );
};

export default Home;
