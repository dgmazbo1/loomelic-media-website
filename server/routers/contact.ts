/**
 * contact.ts — Contact form submission router
 * Saves submission to DB and sends email notification to Denham@loomelicmedia.com
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { Resend } from "resend";
import { notifyOwner } from "../_core/notification";

// Resend client — initialized lazily when API key is present
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const NOTIFY_EMAIL = "Denham@loomelicmedia.com";
const FROM_EMAIL = "noreply@loomelicmedia.com";

function buildEmailHtml(data: {
  name: string;
  dealership: string;
  role: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:8px 16px 8px 0;font-size:13px;color:#666;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;font-size:13px;color:#111;">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:28px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;color:#666;text-transform:uppercase;">Loomelic Media</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">New Contact Form Submission</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:14px;color:#444;line-height:1.6;">
              A new inquiry was submitted on <strong>loomelicmedia.com</strong>. Here are the details:
            </p>

            <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #eee;">
              ${row("Name", data.name)}
              ${row("Dealership", data.dealership)}
              ${row("Role", data.role)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#0a0a0a;">${data.email}</a>`)}
              ${row("Phone", data.phone ? `<a href="tel:${data.phone}" style="color:#0a0a0a;">${data.phone}</a>` : "")}
              ${row("Service", data.service)}
            </table>

            <!-- Message -->
            <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;border-left:3px solid #0a0a0a;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.12em;color:#888;text-transform:uppercase;font-weight:600;">Message</p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
            </div>

            <!-- CTA -->
            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${data.email}?subject=Re: Your Loomelic Media Inquiry"
                 style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:13px;font-weight:600;letter-spacing:0.05em;">
                REPLY TO ${data.name.split(" ")[0].toUpperCase()} →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f9f9f9;border-top:1px solid #eee;">
            <p style="margin:0;font-size:11px;color:#999;text-align:center;">
              Submitted via loomelicmedia.com · ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "full", timeStyle: "short" })} PT
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        dealership: z.string().optional().default(""),
        role: z.string().optional().default(""),
        email: z.string().email("Valid email required"),
        phone: z.string().optional().default(""),
        service: z.string().optional().default(""),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { name, dealership, role, email, phone, service, message } = input;

      // 1. Send email via Resend (if API key is configured)
      let emailSent = false;
      const resendClient = getResend();
      if (resendClient) {
        try {
          const { error } = await resendClient.emails.send({
            from: `Loomelic Media <${FROM_EMAIL}>`,
            to: [NOTIFY_EMAIL],
            replyTo: email,
            subject: `New Inquiry from ${name}${dealership ? ` — ${dealership}` : ""}`,
            html: buildEmailHtml({ name, dealership, role, email, phone, service, message }),
          });
          if (error) {
            console.warn("[Contact] Resend error:", error);
          } else {
            emailSent = true;
          }
        } catch (err) {
          console.warn("[Contact] Failed to send email:", err);
        }
      }

      // 2. Always fire the built-in owner notification as a fallback
      const notifContent = [
        `From: ${name}${dealership ? ` (${dealership})` : ""}`,
        `Role: ${role || "Not specified"}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service || "Not specified"}`,
        `Message: ${message}`,
      ].join("\n");

      await notifyOwner({
        title: `New contact form submission from ${name}`,
        content: notifContent,
      }).catch(() => {});

      return { success: true, emailSent };
    }),
});
