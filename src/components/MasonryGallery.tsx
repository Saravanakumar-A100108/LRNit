import { galleryImages } from "@/data/gallery";

const MasonryGallery = () => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {galleryImages.map((img) => (
        <div
          key={img.id}
          className="break-inside-avoid rounded-lg overflow-hidden group relative"
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-sm font-medium text-foreground">{img.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGallery;
