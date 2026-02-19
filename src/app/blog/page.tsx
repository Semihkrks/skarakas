import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BlogPageContent } from "./blog-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Yazılım geliştirme, tasarım ve teknoloji hakkında yazılar.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <BlogPageContent />
      </main>
      <Footer />
    </>
  );
}
