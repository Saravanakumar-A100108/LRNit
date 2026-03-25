CREATE POLICY "Allow insert programs" ON public.programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update programs" ON public.programs FOR UPDATE USING (true);
CREATE POLICY "Allow delete programs" ON public.programs FOR DELETE USING (true);