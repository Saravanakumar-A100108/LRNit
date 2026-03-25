import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Code, Calendar, Users, ExternalLink, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

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

const RevealSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`opacity-0 ${className}`}>{children}</div>;
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
    <div className="min-h-screen animate-page-enter">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-10 md:pb-14 px-4 md:px-6">
        <div className="container mx-auto text-center max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">What We Do</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-title-drop">
            Our Events
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed animate-subtitle-rise">
            Discover how LRNit empowers you through immersive programs designed to accelerate your tech career.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section className="pb-16 md:pb-24 px-4 md:px-6">
          <div className="container mx-auto max-w-3xl space-y-8">
            {programs.map((program, i) => {
              const Icon = iconMap[program.icon] || Code;
              return (
                <RevealSection key={program.id}>
                  <div className="flex flex-col md:flex-row gap-5 items-start p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                    {program.photo ? (
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img src={program.photo} alt={program.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2 text-left">
                        {program.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-2">
                        {program.description}
                      </p>
                      <p className="text-foreground/70 leading-relaxed text-sm mb-4">
                        {program.details}
                      </p>
                      {program.enroll_link && (
                        <a
                          href={program.enroll_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                        >
                          Enroll Now <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </section>
      )}

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </div>
  );
};

export default Programs;
