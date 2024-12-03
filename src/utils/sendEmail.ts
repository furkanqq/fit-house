import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  service: "gmail",
  auth: {
    user: "furkanilhanresmi@gmail.com",
    pass: "lojlpkfdnuoadnsn", // Uygulama şifresi kullan
  },
});

export default async function sendEmail(
  to: string,
  subject: string,
  text: string
) {
  await transporter.sendMail({
    from: "furkanilhanresmi@gmail.com",
    to,
    subject,
    text,
  });
}
