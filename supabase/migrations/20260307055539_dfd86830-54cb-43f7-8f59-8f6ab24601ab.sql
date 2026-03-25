
-- Create department enum
CREATE TYPE public.department AS ENUM ('CEO', 'Manager', 'Tech', 'Event Management', 'Media', 'Sponsorship', 'HR', 'PR');

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements FOR SELECT USING (true);

-- Create gallery table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is viewable by everyone" ON public.gallery FOR SELECT USING (true);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  department department NOT NULL DEFAULT 'Tech',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Seed initial team members
INSERT INTO public.team_members (name, role, photo, department) VALUES
  ('Alex Rivera', 'Lead Instructor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', 'Tech'),
  ('Samira Patel', 'Program Director', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face', 'Manager'),
  ('Jordan Chen', 'Tech Lead', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', 'Tech'),
  ('Maya Thompson', 'UX Designer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', 'Media'),
  ('David Kim', 'Data Scientist', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face', 'Tech'),
  ('Priya Sharma', 'Community Manager', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face', 'PR'),
  ('Marcus Johnson', 'Mentor', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face', 'HR'),
  ('Lena Nguyen', 'Operations Lead', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face', 'Event Management');

-- Seed initial gallery
INSERT INTO public.gallery (src, alt, title, description, sort_order) VALUES
  ('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop', 'Team collaboration session', 'Collaboration', 'Working together to solve real-world challenges', 1),
  ('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop', 'Workshop in progress', 'Workshops', 'Hands-on learning with industry experts', 2),
  ('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop', 'Presentation day', 'Demo Day', 'Showcasing projects to the community', 3),
  ('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop', 'Hackathon event', 'Hackathons', '48 hours of innovation and creativity', 4),
  ('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop', 'Coding bootcamp', 'Bootcamps', 'Intensive programs to accelerate your skills', 5),
  ('https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop', 'Mentorship program', 'Mentorship', 'Guided growth from experienced leaders', 6),
  ('https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=1200&h=600&fit=crop', 'Community meetup', 'Community', 'Building connections that last a lifetime', 7),
  ('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop', 'Innovation lab', 'Innovation Lab', 'Where ideas become reality', 8);

-- Seed a sample announcement
INSERT INTO public.announcements (title, content, active) VALUES
  ('Welcome to LRNit!', 'We are excited to launch our new platform. Stay tuned for upcoming workshops and events.', true);
