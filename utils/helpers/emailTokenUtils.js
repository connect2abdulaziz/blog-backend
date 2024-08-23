import { generateToken } from './tokenUtils.js'; 
import  sendEmail  from './emailUtils.js'; 
import { ERROR_MESSAGES, STATUS_CODE } from '../constants/constants.js';
import AppError from '../errors/appError.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const sendEmailWithToken = async ({
  userId,
  email,
  subject,
  textTemplate,
  htmlTemplate,
  endpoint,
  tokenExpiresIn,
}) => {
  try {
    // Generate a token with the user ID and expiration time
    const token = generateToken({ userId }, tokenExpiresIn);

    // Ensure the token is encoded (though not strictly necessary for path segments)
    const encodedToken = encodeURIComponent(token);
    // Construct the URL with the token in the path
    const url = `${process.env.FRONTEND_URL}${endpoint}/${encodedToken}`;

    // Prepare the email content using the provided templates
    const textContent = textTemplate(url);
    const htmlContent = htmlTemplate(url);

    // Send the email
    await sendEmail({
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
    });

  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.EMAIL_SEND_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

export {
  sendEmailWithToken,
};
