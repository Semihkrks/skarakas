export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  gradient: string;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  gradient: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  reading_time: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}
