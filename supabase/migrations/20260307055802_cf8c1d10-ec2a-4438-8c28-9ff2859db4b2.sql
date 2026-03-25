
-- Allow all operations on announcements (admin-managed, no user auth)
CREATE POLICY "Allow insert announcements" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update announcements" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Allow delete announcements" ON public.announcements FOR DELETE USING (true);

-- Allow all operations on gallery
CREATE POLICY "Allow insert gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update gallery" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow delete gallery" ON public.gallery FOR DELETE USING (true);

-- Allow all operations on team_members
CREATE POLICY "Allow insert team_members" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update team_members" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "Allow delete team_members" ON public.team_members FOR DELETE USING (true);

-- Allow select on contact_submissions
CREATE POLICY "Allow select contact_submissions" ON public.contact_submissions FOR SELECT USING (true);
