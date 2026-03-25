import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TeamMarquee = () => {
  const { data: members = [] } = useQuery({
    queryKey: ["team_members_marquee"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  if (!members.length) return null;

  return (
    <div className="w-full relative overflow-hidden bg-background/50 border-y border-border/50 py-10">
      <div className="flex w-max animate-marquee gap-6 items-center">
        {/* First set of members */}
        {[...members, ...members].map((m, i) => (
          <div
            key={`${m.id || i}-${i}`}
            className="flex gap-4 items-center bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-5 min-w-[300px] hover:border-primary/30 transition-colors group"
          >
            {m.photo && (
              <div className="relative">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary/30 transition-colors"
                />
                <div className="absolute inset-0 rounded-full bg-primary/5 group-hover:bg-transparent transition-colors" />
              </div>
            )}
            <div>
              <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{m.name}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gradient masks for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default TeamMarquee;
