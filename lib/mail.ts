import "server-only";

import { Resend } from "resend";
import { env } from "@/lib/env";

function resendClient() {
  if (!env.resendApiKey) {
    return null;
  }
  return new Resend(env.resendApiKey);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = resendClient();

  if (!resend) {
    console.log(`[CMG password reset] ${to}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: env.resendFrom,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h1 style="font-size:22px;margin:0 0 16px">Reset your password</h1>
        <p>Use the secure link below to set a new password. It expires in 30 minutes.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#111827;color:#ffffff;padding:12px 18px;text-decoration:none;border-radius:6px">Reset password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
}
