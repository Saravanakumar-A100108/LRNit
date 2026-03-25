CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Code',
  details TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on programs" ON public.programs
  FOR SELECT USING (true);

INSERT INTO public.programs (title, description, icon, details, sort_order) VALUES
  ('Workshops', 'Hands-on technical workshops covering web dev, AI, cloud, and more — led by industry practitioners and senior members.', 'Code', 'Our workshops are immersive, hands-on sessions designed to take you from concept to creation. Whether you''re diving into React, exploring machine learning, or deploying to the cloud, our expert-led workshops give you real skills you can apply immediately. Each session includes live coding, Q&A, and take-home projects to reinforce your learning.', 1),
  ('Hackathons', 'Compete in themed hackathons, build MVPs in 24–48 hours, and showcase your skills to peers and sponsors.', 'Calendar', 'Our hackathons are high-energy events where teams come together to solve real problems in 24–48 hours. With mentors on standby, sponsor prizes, and a supportive community, you''ll push your limits and walk away with a portfolio-worthy project. Past themes include sustainability tech, fintech solutions, and AI for social good.', 2),
  ('Mentorship', 'Get paired with experienced mentors who guide your growth, review your projects, and help you navigate your tech career.', 'Users', 'Our mentorship program connects you with seasoned professionals who''ve been where you are. Through regular 1-on-1 sessions, code reviews, career guidance, and goal-setting, your mentor helps you grow faster and smarter. Whether you''re a beginner or leveling up, there''s a mentor ready to help you succeed.', 3);