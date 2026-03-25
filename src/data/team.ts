// CMS Collection: Team Profiles
// Edit this file to add/remove/update team members

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export const teamMembers: TeamMember[] = [
  { id: "1", name: "Alex Rivera", role: "Lead Instructor", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { id: "2", name: "Samira Patel", role: "Program Director", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
  { id: "3", name: "Jordan Chen", role: "Tech Lead", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
  { id: "4", name: "Maya Thompson", role: "UX Designer", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
  { id: "5", name: "David Kim", role: "Data Scientist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
  { id: "6", name: "Priya Sharma", role: "Community Manager", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face" },
  { id: "7", name: "Marcus Johnson", role: "Mentor", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face" },
  { id: "8", name: "Lena Nguyen", role: "Operations Lead", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face" },
];
