import { generateToken } from "./tokenUtils";
import sendEmail from "./emailUtils";
import { ERROR_MESSAGES, STATUS_CODE } from "../constants/constants";
import { AppError } from "../errors/appError";

import { APP_CONFIG } from "../../config/app.config";

// Ensure environment variables are typed
const { FRONTEND_URL } = APP_CONFIG;

// Interface for function parameters
interface SendEmailWithTokenParams {
  userId: number;
  email: string;
  subject: string;
  textTemplate: (url: string) => string;
  htmlTemplate: (url: string) => string;
  endpoint: string;
  tokenExpiresIn: string;
}

// Send an email with a generated token
const sendEmailWithToken = async ({
  userId,
  email,
  subject,
  textTemplate,
  htmlTemplate,
  endpoint,
}: SendEmailWithTokenParams): Promise<void> => {
  try {
    // Generate a token with the user ID and expiration time
    const token = generateToken(userId);

    // Encode the token (for safe use in URLs)
    const encodedToken = encodeURIComponent(token);

    // Construct the URL with the token in the path
    const url = `${FRONTEND_URL}${endpoint}/${encodedToken}`;

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
    throw new AppError(
      ERROR_MESSAGES.EMAIL_SEND_FAILED,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export { sendEmailWithToken };
