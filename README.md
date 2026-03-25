# 🌟 LRNit

**Learn. Build. Lead.**

LRNit is a comprehensive platform dedicated to empowering the next generation of tech leaders through immersive learning experiences, real-world building opportunities, and transformative leadership training.

---

## ✨ Features

- **🏠 Interactive Homepage**: A dynamic landing page showcasing LRNit's mission, impact, and core values.
- **📚 Educational Programs**: Detailed information about various tech programs, courses, and learning paths.
- **👥 Team Showcase**: An interactive team page featuring an infinite marquee of our mentors and contributors.
- **📢 Announcements**: Stay updated with the latest news, events, and opportunities from the LRNit community.
- **🖼️ Gallery**: A visually stunning masonry gallery and carousel showcasing our events, projects, and achievements.
- **🤖 AI-Powered ChatBot**: Integrated intelligent assistant to help users navigate and learn more about our offerings.
- **🔐 Admin Dashboard**: Secure management interface for administrators to update content, team members, and programs.
- **✉️ Contact Integration**: Seamless communication through integrated contact forms.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)

### Backend & Infrastructure
- **Base**: [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, and Storage)
- **Logic**: Supabase Edge Functions (Deno)
- **Deployment**: Git-integrated workflow

## 📁 Project Structure

```bash
├── src/
│   ├── components/      # Reusable UI components (Navbar, ChatBot, Gallery, etc.)
│   ├── pages/           # Page-level components (Home, Admin, Programs, etc.)
│   ├── integrations/    # Supabase client and third-party integrations
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared logic
│   └── data/            # Static data and constants
├── supabase/
│   ├── functions/       # Edge Functions (Chat, Sync Knowledge)
│   └── migrations/      # Database schema and migrations
└── public/              # Static assets (images, icons, etc.)
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Saravanakumar-A100108/LRNit.Org.git
   cd LRNit.Org
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the development server**:
   ```sh
   npm run dev
   ```

---

© 2024 LRNit. All rights reserved.

