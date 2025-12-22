"use server";

import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Léopoldine Almeida" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to,
      subject,
      html,
    });
    ;
    return { success: true };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
