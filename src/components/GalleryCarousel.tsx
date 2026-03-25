import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const INTERVAL = 2000;

const GalleryCarousel = () => {
  const { data: galleryImages = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = galleryImages.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % (total || 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + (total || 1)) % (total || 1)), [total]);

  useEffect(() => {
    if (isHovered || total === 0) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, isHovered, total]);

  if (galleryImages.length === 0) return null;

  return (
    <div
      className="relative rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] md:aspect-[2/1] bg-card">
        {galleryImages.map((img, i) => (
          <img
            key={img.id}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      <div className="absolute bottom-10 md:bottom-12 left-0 right-0 text-center px-4 md:px-6">
        <h3 className="text-lg md:text-2xl font-bold text-foreground mb-1">
          {galleryImages[current]?.title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          {galleryImages[current]?.description}
        </p>
      </div>

      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/60 text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/60 text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current
                ? "bg-primary w-6"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryCarousel;
