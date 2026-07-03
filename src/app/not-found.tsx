import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-7xl font-black text-gradient sm:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Sayfa Bulunamadı</h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--muted-foreground)]">
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25 transition-shadow hover:shadow-xl"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
