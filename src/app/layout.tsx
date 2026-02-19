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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
