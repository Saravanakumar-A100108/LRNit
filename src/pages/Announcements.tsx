import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";

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
    <div className="min-h-screen animate-page-enter">
      <Navbar />
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Latest Updates</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 animate-title-drop">
              Announcements
            </h1>
            <p className="text-muted-foreground text-sm animate-subtitle-rise">
              Stay up to date with the latest news from LRNit.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 animate-float-up">
              No announcements at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((a, i) => (
                <article
                  key={a.id}
                  className={`bg-card/50 border border-border rounded-lg p-5 hover:bg-card transition-colors animate-float-up stagger-${Math.min(i + 1, 6)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-foreground mb-1">{a.title}</h2>
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
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </div>
  );
};

export default Announcements;
