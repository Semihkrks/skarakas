import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Semih Karakaş | Full-Stack Yazılım Geliştirici",
    template: "%s | skarakas.com",
  },
  description:
    "Modern web teknolojileri ile yüksek performanslı, estetik ve kullanıcı deneyimi odaklı dijital ürünler tasarlıyor ve geliştiriyorum.",
  keywords: [
    "Semih Karakaş",
    "skarakas",
    "yazılım geliştirici",
    "full-stack developer",
    "web geliştirme",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Semih Karakaş" }],
  creator: "Semih Karakaş",
  metadataBase: new URL("https://skarakas.com"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://skarakas.com",
    siteName: "skarakas.com",
    title: "Semih Karakaş | Full-Stack Yazılım Geliştirici",
    description:
      "Modern web teknolojileri ile yüksek performanslı dijital ürünler geliştiriyorum.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semih Karakaş | Full-Stack Yazılım Geliştirici",
    description:
      "Modern web teknolojileri ile yüksek performanslı dijital ürünler geliştiriyorum.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://skarakas.com/#person",
      name: "Semih Karakaş",
      url: "https://skarakas.com",
      image: "https://skarakas.com/logo.png",
      jobTitle: "Full-Stack Yazılım Geliştirici",
      description:
        "5 yılı aşkın deneyime sahip full-stack yazılım geliştirici. React, Next.js, TypeScript ve modern backend teknolojileriyle 50'den fazla proje teslim etti; kurumsal siteler, SaaS platformları ve e-ticaret çözümleri geliştiriyor.",
      email: "mailto:semih@skarakas.com",
      telephone: "+90-552-180-46-55",
      knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Supabase", "Web Geliştirme"],
      workExample: [
        { "@type": "WebSite", name: "Ustakur", url: "https://ustakur.com" },
        { "@type": "WebSite", name: "Nass Event", url: "https://nassevent.com" },
        { "@type": "WebSite", name: "Netvora", url: "https://netvora.tr" },
        { "@type": "WebSite", name: "Sonvera", url: "https://sonvera.com.tr" },
        { "@type": "WebSite", name: "Kavza Kimya", url: "https://kavzakimya.com" },
        { "@type": "WebSite", name: "Cataloglu Gezi Turizm", url: "https://cataloglugeziturizm.com.tr" },
      ],
      sameAs: [
        "https://github.com/ssemihkarakass",
        "https://instagram.com/ssemihkarakass",
        "https://linkedin.com/in/skarakas",
        "https://twitter.com/skarakas",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://skarakas.com/#website",
      name: "skarakas.com",
      url: "https://skarakas.com",
      inLanguage: "tr-TR",
      publisher: { "@id": "https://skarakas.com/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
