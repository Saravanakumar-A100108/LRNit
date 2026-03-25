// CMS Collection: Photo Gallery
// Edit this file to add/remove/update gallery images and captions

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  span?: "tall" | "wide" | "normal";
}

export const galleryImages: GalleryImage[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop", alt: "Team collaboration session", title: "Collaboration", description: "Working together to solve real-world challenges" },
  { id: "2", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop", alt: "Workshop in progress", title: "Workshops", description: "Hands-on learning with industry experts" },
  { id: "3", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop", alt: "Presentation day", title: "Demo Day", description: "Showcasing projects to the community" },
  { id: "4", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop", alt: "Hackathon event", title: "Hackathons", description: "48 hours of innovation and creativity" },
  { id: "5", src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop", alt: "Coding bootcamp", title: "Bootcamps", description: "Intensive programs to accelerate your skills" },
  { id: "6", src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop", alt: "Mentorship program", title: "Mentorship", description: "Guided growth from experienced leaders" },
  { id: "7", src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=1200&h=600&fit=crop", alt: "Community meetup", title: "Community", description: "Building connections that last a lifetime" },
  { id: "8", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop", alt: "Innovation lab", title: "Innovation Lab", description: "Where ideas become reality" },
];
