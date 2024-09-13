import nodemailer from "nodemailer";
import { APP_CONFIG } from "../../config/app.config";
const { EMAIL_FROM, EMAIL_PASS } = APP_CONFIG;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

export default sendEmail;
