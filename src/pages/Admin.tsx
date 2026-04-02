import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, ImageIcon, Users, Mail, LogOut, Trash2, Pencil, Plus, BookOpen, Check, Upload } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";
import { Constants } from "@/integrations/supabase/types";

import { toast } from "sonner";

const ADMIN_PASSWORD = "lrnit-admin-2024"; // Simple password protection

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const queryClient = useQueryClient();

  // Check session storage and handle auto-logout on tab switch
  useEffect(() => {
    if (sessionStorage.getItem("lrnit_admin") === "true") setAuthed(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.removeItem("lrnit_admin");
        setAuthed(false);
        setPassword(""); // Clear password field too
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("lrnit_admin", "true");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-8 w-full max-w-sm space-y-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            <span className="text-primary">Admin</span> Login
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {authError && <p className="text-destructive text-sm">{authError}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:box-glow transition-all">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">LRNit</span> Admin
        </h1>
        <button
          onClick={() => { sessionStorage.removeItem("lrnit_admin"); setAuthed(false); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="container mx-auto max-w-5xl py-8 px-6">
        <Tabs defaultValue="announcements">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="announcements" className="flex items-center gap-2"><Megaphone className="w-4 h-4" /> Announcements</TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2"><Users className="w-4 h-4" /> Team</TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Events</TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements"><AnnouncementsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryAdmin /></TabsContent>
          <TabsContent value="team"><TeamAdmin /></TabsContent>
          <TabsContent value="programs"><ProgramsAdmin /></TabsContent>
          <TabsContent value="contacts"><ContactsAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ─── Announcements ──────────────────────────────────────────
function AnnouncementsAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Tables<"announcements"> | null>(null);
  const [form, setForm] = useState({ title: "", content: "", active: true });
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("announcements").update({ title: form.title, content: form.content, active: form.active }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("announcements").insert({ title: form.title, content: form.content, active: form.active });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      const msg = editing ? "Announcement updated ✓" : "Announcement added ✓";
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      resetForm();
      toast.success(msg);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to save announcement. (Check RLS policies)");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      toast.success("Announcement removed");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to remove announcement.");
    },
  });

  const resetForm = () => { setEditing(null); setForm({ title: "", content: "", active: true }); };

  const startEdit = (item: Tables<"announcements">) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, active: item.active });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "New"} Announcement</h3>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content" rows={3} required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-primary" /> Active
        </label>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:box-glow transition-all">{editing ? "Update" : "Add"}</button>
          {editing && <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {item.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove.mutate(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────
function GalleryAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Tables<"gallery"> | null>(null);
  const [form, setForm] = useState({ src: "", alt: "", title: "", description: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("gallery").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery").insert({ ...form, sort_order: items.length + 1 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      const msg = editing ? "Gallery image updated ✓" : "Gallery image added ✓";
      queryClient.invalidateQueries({ queryKey: ["admin_gallery"] });
      resetForm();
      toast.success(msg);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to save gallery image. (Check RLS policies)");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery"] });
      toast.success("Gallery image removed");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to remove gallery image.");
    },
  });

  const resetForm = () => { setEditing(null); setForm({ src: "", alt: "", title: "", description: "" }); };

  const startEdit = (item: Tables<"gallery">) => {
    setEditing(item);
    setForm({ src: item.src, alt: item.alt, title: item.title, description: item.description });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "New"} Gallery Image</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Upload Image</label>
          <ImageUpload
            onUpload={(url) => setForm({ ...form, src: url })}
            defaultValue={form.src}
          />
        </div>
        <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} placeholder="Alt text" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:box-glow transition-all">{editing ? "Update" : "Add"}</button>
          {editing && <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <img src={item.src} alt={item.alt} className="w-full h-32 object-cover" />
            <div className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => startEdit(item)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => remove.mutate(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Team ──────────────────────────────────────────
function TeamAdmin() {
  const queryClient = useQueryClient();
  const departments = Constants.public.Enums.department;
  const [editing, setEditing] = useState<Tables<"team_members"> | null>(null);
  const [form, setForm] = useState({ name: "", role: "", photo: "", department: "Tech" as Tables<"team_members">["department"], description: "", linkedin: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin_team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("team_members").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert({ ...form, sort_order: items.length + 1 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      const msg = editing ? "Team member updated ✓" : "Team member added ✓";
      queryClient.invalidateQueries({ queryKey: ["admin_team"] });
      resetForm();
      toast.success(msg);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to save team member. (Check RLS policies)");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_team"] });
      toast.success("Team member removed");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to remove team member.");
    },
  });

  const resetForm = () => { setEditing(null); setForm({ name: "", role: "", photo: "", department: "Tech", description: "", linkedin: "" }); };

  const startEdit = (item: Tables<"team_members">) => {
    setEditing(item);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm({ name: item.name, role: item.role, photo: item.photo, department: item.department, description: item.description, linkedin: (item as any).linkedin || "" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "New"} Team Member</h3>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Photo</label>
          <ImageUpload
            onUpload={(url) => setForm({ ...form, photo: url })}
            defaultValue={form.photo}
          />
        </div>
        <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as Tables<"team_members">["department"] })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={2} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn Profile URL (optional)" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:box-glow transition-all">{editing ? "Update" : "Add"}</button>
          {editing && <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            {item.photo && <img src={item.photo} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-primary/30" />}
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.role} · {item.department}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove.mutate(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Programs ──────────────────────────────────────────
function ProgramsAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "Code", details: "", active: true, photo: "", enroll_link: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin_programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("programs").update({ title: form.title, description: form.description, icon: form.icon, details: form.details, active: form.active, photo: form.photo, enroll_link: form.enroll_link }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("programs").insert({ ...form, sort_order: items.length + 1 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      const msg = editing ? "Event updated ✓" : "Event added ✓";
      queryClient.invalidateQueries({ queryKey: ["admin_programs"] });
      resetForm();
      toast.success(msg);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to save event. (Check RLS policies)");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_programs"] });
      toast.success("Event removed");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to remove event.");
    },
  });

  const resetForm = () => { setEditing(null); setForm({ title: "", description: "", icon: "Code", details: "", active: true, photo: "", enroll_link: "" }); };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, icon: item.icon, details: item.details, active: item.active, photo: item.photo || "", enroll_link: item.enroll_link || "" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "New"} Event</h3>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Detailed description" rows={4} required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Event Photo (optional)</label>
          <ImageUpload
            onUpload={(url) => setForm({ ...form, photo: url })}
            defaultValue={form.photo}
          />
        </div>
        <input value={form.enroll_link} onChange={(e) => setForm({ ...form, enroll_link: e.target.value })} placeholder="Enroll Link (optional)" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        {form.photo && <img src={form.photo} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-border" />}
        <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="Code">Code (fallback icon)</option>
          <option value="Calendar">Calendar (fallback icon)</option>
          <option value="Users">Users (fallback icon)</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-primary" /> Active
        </label>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:box-glow transition-all">{editing ? "Update" : "Add"}</button>
          {editing && <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {item.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove.mutate(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contacts ──────────────────────────────────────────
function ContactsAdmin() {
  const { data: items = [] } = useQuery({
    queryKey: ["admin_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Messages ({items.length})</h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-primary mb-2">{item.email}</p>
              <p className="text-sm text-muted-foreground">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
