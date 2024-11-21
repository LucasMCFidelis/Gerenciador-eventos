// src/utils/email/sendEmail.ts
import nodemailer from "nodemailer";
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };
  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Erro ao enviar e-mail");
  }
}

export {
  sendEmail
};
