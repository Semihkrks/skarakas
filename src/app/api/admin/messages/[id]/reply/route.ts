import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

type Params = { params: Promise<{ id: string }> };

function buildReplyEmailHTML(recipientName: string, originalMessage: string, replyText: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #14b8a6, #6366f1); padding: 30px; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Merhaba ${recipientName},</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">skarakas.com üzerinden mesajınıza yanıt</p>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <div style="color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${replyText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
      <div style="background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; font-weight: 600;">Orijinal mesajınız:</p>
        <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; border-left: 3px solid #d1d5db; padding-left: 12px; white-space: pre-wrap;">${originalMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #9ca3af; font-size: 12px;">Bu e-posta <a href="https://skarakas.com" style="color: #14b8a6; text-decoration: none;">skarakas.com</a> üzerinden gönderilmiştir.</p>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const { replyText } = await req.json();

    if (!replyText?.trim()) {
      return NextResponse.json({ error: "Yanıt metni gerekli" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch original message
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json({ error: "Mesaj bulunamadı" }, { status: 404 });
    }

    // Send reply email via Resend
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_API_KEY")) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "skarakas.com <onboarding@resend.dev>",
          to: message.email,
          subject: `Re: ${message.subject || "İletişim"}`,
          html: buildReplyEmailHTML(message.name, message.message, replyText),
        });
      } catch (emailError) {
        console.error("Reply email error:", emailError);
        return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
      }
    }

    // Update message record with reply info
    const { error: updateError } = await supabase
      .from("messages")
      .update({
        replied_at: new Date().toISOString(),
        reply_text: replyText,
        read: true,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply API error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
