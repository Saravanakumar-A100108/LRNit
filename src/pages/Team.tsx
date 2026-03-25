import Navbar from "@/components/Navbar";
import { Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { useEffect, useRef } from "react";

const DEPARTMENT_ORDER = [
  "CEO", "Manager", "Tech", "Event Management", "Media", "Sponsorship", "HR", "PR",
] as const;

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

const Team = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Tables<"team_members">[];
    },
  });

  const grouped = DEPARTMENT_ORDER.map((dept) => ({
    department: dept,
    members: members.filter((m) => m.department === dept),
  })).filter((g) => g.members.length > 0);

  return (
    <div className="min-h-screen animate-page-enter">
      <Navbar />
      <section className="pt-24 md:pt-32 pb-8 md:pb-10 px-4 md:px-6">
        <div className="container mx-auto text-center max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">The People</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3 animate-title-drop">
            Our Team
          </h1>
          <p className="text-muted-foreground text-sm animate-subtitle-rise">
            The passionate individuals driving LRNit's mission forward.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            grouped.map((group) => (
              <RevealSection key={group.department} className="mb-12">
                <h2 className="text-lg font-bold text-foreground mb-5 pb-2 border-b border-border">
                  {group.department}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member, i) => (
                    <div
                      key={member.id}
                      className={`bg-card/50 border border-border rounded-lg p-5 flex flex-col items-center gap-3 hover:bg-card transition-colors animate-float-up stagger-${Math.min(i + 1, 6)}`}
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover border border-border"
                        loading="lazy"
                      />
                      <div className="text-center">
                        <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                        <p className="text-xs text-primary mt-0.5">{member.role}</p>
                        {member.description && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.description}</p>
                        )}
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(member as any).linkedin && (
                          <a
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            href={(member as any).linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mt-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            ))
          )}
        </div>
      </section >

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </div >
  );
};

export default Team;
