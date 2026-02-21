import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Path gerekli" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || null;

    // Hash IP for privacy - never store raw IPs
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const dailySalt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + dailySalt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const supabase = await createClient();
    await supabase.from("page_views").insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      ip_hash: ipHash,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
