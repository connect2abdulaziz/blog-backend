import nodemailer from 'nodemailer';

const { EMAIL_FROM, EMAIL_PASSWORD_FORGOT_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD_FORGOT_PASSWORD,
  },
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
