import * as React from "react";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdjbbpp";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      // Save to Supabase
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({ name: form.name, email: form.email, message: form.message });
      if (dbError) throw dbError;

      // Also send to Formspree for email notification
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _replyto: form.email,
        }),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center text-center gap-6 py-12">
        <div className="relative">
          <CheckCircle className="w-16 h-16 text-primary animate-[checkpop_0.5s_ease-out_forwards]" />
        </div>
        <div className="space-y-3 max-w-md">
          <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
          <p className="text-muted-foreground leading-relaxed">
            At LRNit, we believe every great journey starts with a single step. Let's{" "}
            <span className="text-primary font-semibold">Build</span> the future together.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", message: "" });
          }}
          className="mt-4 px-6 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={100}
          required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          maxLength={255}
          required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          maxLength={1000}
          rows={5}
          required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
          placeholder="Tell us what's on your mind..."
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:box-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
