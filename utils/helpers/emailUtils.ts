import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Ensure environment variables are typed
const { EMAIL_FROM, EMAIL_PASS } = process.env as {
  EMAIL_FROM: string;
  EMAIL_PASS: string;
};

if (!EMAIL_FROM || !EMAIL_PASS) {
  throw new Error("Missing EMAIL_FROM or EMAIL_PASS in environment variables");
}

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
  logger: true,  // Enable logging for debugging
  debug: true,   // Enable debug output
});

// Define the types for the email options
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Function to send an email
const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};

export default sendEmail;
