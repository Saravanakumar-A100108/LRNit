import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { Mail, Linkedin, Instagram } from "lucide-react";

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/lrnitorg/" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/lrnit_org?igsh=MTN3dGt4bXRzaGxoYg==" },
  { icon: Mail, label: "Email", href: "mailto:contact.lrnit@gmail.com" },
];

const Contact = () => {
  return (
    <div className="min-h-screen animate-page-enter">
      <Navbar />
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Let's Connect</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 animate-title-drop">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-sm animate-subtitle-rise">
              Have a question or want to collaborate? Reach out to us.
            </p>
          </div>

          <ContactForm />

          <div className="mt-12 flex justify-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-md bg-card/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LRNit. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;
