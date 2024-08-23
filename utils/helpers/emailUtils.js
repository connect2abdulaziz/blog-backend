import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { EMAIL_FROM, EMAIL_PASS } = process.env;

if (!EMAIL_FROM || !EMAIL_PASS) {
  throw new Error("Missing EMAIL_FROM or EMAIL_PASS in environment variables");
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
  logger: true,  // Enable logging for debugging
  debug: true,   // Enable debug output
});

const sendEmail = async ({ to, subject, text, html }) => {
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
