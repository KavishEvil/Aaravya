import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

const FROM = process.env.SMTP_FROM ?? "Aaravya Hospital <no-reply@aaravyahospital.local>";

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
