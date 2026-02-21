import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { ProjectsSection } from "@/components/sections/projects";
import { BlogSection } from "@/components/sections/blog";
import { ContactSection } from "@/components/sections/contact";

function SectionDivider() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <ServicesSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <BlogSection />
        <SectionDivider />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
