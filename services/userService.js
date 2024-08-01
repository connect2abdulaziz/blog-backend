const User = require("../db/models/user");
const AppError = require("../utils/appError");
const { hashPassword } = require("../utils/hashPasswordUtils");
const { generateToken } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {ERROR_MESSAGES, STATUS_CODE} = require('../utils/constants');


// Create a new user with enhanced error handling
const createUserServices = async ({ firstName, lastName, email, password }) => {
    try {
        // Check if the email is already registered
        const alreadyRegistered = await findByEmail(email);
        if (alreadyRegistered) {
            throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
        }
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Process and return user data
        const result = newUser.toJSON();
        const { password: pass, profilePicture, thumbnail, ...cleanedResult } = result;
        cleanedResult.token = generateToken({ id: result.id });
        return cleanedResult;
    } catch (error) {
        if (error instanceof AppError) {
            throw error; 
        }
        throw new AppError('Error creating user', 500); 
    }
};

// Function to login a user with enhanced error handling
const loginUserServices = async ({ email, password }) => {
  try {
    const result = await findByEmail(email);
    if (!result || !(await bcrypt.compare(password, result.password))) {
      throw new AppError(ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, STATUS_CODE.BAD_REQUEST);
    }
    const token = generateToken({ id: result.id });
    return token;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Forgot password functionality
const forgotPasswordServices = async ({ email }) => {
  try {
    const user = await findByEmail(email);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // Generate a reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Construct the reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/user/resetPassword?token=${resetToken}`;

    // Send password reset email
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}\n\nThe link will expire in 1 hour.`,
      html: `<p>You requested a password reset. Please use the following link to reset your password:</p>
             <p><a href="${resetUrl}">Reset Password</a></p>
             <p>The link will expire in 1 hour.</p>`
    });

    return {
      status: 'success',
      message: 'Password reset email sent successfully'
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Reset password functionality
const resetPasswordServices = async ({ newPassword }, token) => {
  try {
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.BAD_REQUEST);
    }

    // Find the user by the decoded ID
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return {
      status: 'success',
      message: 'Password has been reset successfully'
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Adjust based on your email service
  auth: {
    user: process.env.EMAIL_FORGOT_PASSWORD,
    pass: process.env.EMAIL_PASSWORD_FORGOT_PASSWORD
  }
});

// Function to find a user by email
const findByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createUserServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices
};
