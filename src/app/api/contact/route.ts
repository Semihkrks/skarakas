import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.email("Geçerli bir e-posta adresi girin"),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Geçersiz form verisi", details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Supabase'e kaydet
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("messages").insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Mesaj kaydedilemedi" }, { status: 500 });
    }

    // E-posta bildirimi gönder (Resend)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_API_KEY")) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "skarakas.com <onboarding@resend.dev>",
          to: adminEmail || "smhhkrks@gmail.com",
          subject: `Yeni İletişim Mesajı: ${subject || "Konu belirtilmedi"}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #14b8a6, #6366f1); padding: 30px; border-radius: 16px 16px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">📬 Yeni Mesaj</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">skarakas.com iletişim formu</p>
              </div>
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 100px;">İsim</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">E-posta</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #14b8a6;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Konu</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${subject || "Belirtilmedi"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: 600; color: #374151; vertical-align: top;">Mesaj</td>
                    <td style="padding: 12px 0; color: #374151; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding: 16px; background: #ecfdf5; border-radius: 12px; text-align: center;">
                  <a href="mailto:${email}?subject=Re: ${subject || "İletişim"}" style="color: #059669; font-weight: 600; text-decoration: none;">↩️ Yanıtla</a>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        // Email gönderilemese bile mesaj kaydedildi, hata fırlatma
        console.error("Resend email error:", emailError);
      }
    }

    return NextResponse.json({ success: true, message: "Mesajınız alındı!" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
