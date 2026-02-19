import { AdminLoginContent } from "./login-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Giriş",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}
