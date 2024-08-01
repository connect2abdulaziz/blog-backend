const User = require("../db/models/user");
const AppError = require("../utils/appError");
const { hashPassword } = require("../utils/hashPasswordUtils");
const { generateToken } = require("../utils/emailUtils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {ERROR_MESSAGES, STATUS_CODE} = require('../utils/constants');


//Create a new verified user account inside the database
const createUserServices = async ({ firstName, lastName, email, password }) => {
    try {
        console.log("creating new user",
            firstName, lastName, email, password
        )
        const alreadyRegistered = await findByEmail(email);
        if (alreadyRegistered) {
            throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verified: false, 
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Send a verification email
        const verificationToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/user/verify-email/${verificationToken}`;
        await transporter.sendMail({
            to: newUser.email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationUrl}\n\nThe link will expire in 1 hour.`,
            html: `<p>Please verify your email by clicking on the following link:</p>
                   <p><a href="${verificationUrl}">Verify Email</a></p>
                   <p>The link will expire in 1 hour.</p>`
        });

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




const verifyEmailServices = async (token) => {
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
      console.log(user);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
  
      // Check if the email is already verified
      if (user.verified) {
        throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, STATUS_CODE.BAD_REQUEST);
      }
      await User.update({verified: true}, {
        where: { id: user.id },
      });
      return user.id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });

    // Construct the reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/user/resetPassword?token=${resetToken}`;

    // Send password reset email
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}\n\nThe link will expire in 5 minutes.`,
      html: `<p>You requested a password reset. Please use the following link to reset your password:</p>
             <p><a href="${resetUrl}">Reset Password</a></p>
             <p>The link will expire in 1 hour.</p>`
    });

    return user.id;
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
    return user.id;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};





// Get All Users Service
const getAllUsersServices = async () => {
  try {
    return await User.findAll({
      attributes: { exclude: ['password'] } 
    });
  } catch (error) {
    throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Get User By ID Service
const getUserByIdServices = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } 
    });
    console.log(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};



//update the user with name and image
const updateUserServices = async (userId, updates) => {
    try {
      // Find the user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
  
      // Update user details
      await user.update(updates);
      
      // Return updated user data
      const result = user.toJSON();
      const { password, ...cleanedResult } = result;
      return cleanedResult;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  };



// Delete the user from the database
const deleteUserServices = async (userId) => {
    try {
      // Find the user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
      await user.destroy();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  };



  // Update User Password Service
const changePasswordServices = async (userId, {oldPassword, newPassword}) => {
    try {
      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
  
      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new AppError(ERROR_MESSAGES.INCORRECT_OLD_PASSWORD, STATUS_CODE.BAD_REQUEST);
      }
  
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
  
      // Update the password
      user.password = hashedPassword;
      await user.save();
  
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error changing password', STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  };

// Function to find a user by email
const findByEmail = async (email) => {
  try {
    const exists = await User.findOne({ where: { email } });
    return exists;
  } catch (error) {
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

module.exports = {
  createUserServices,
  verifyEmailServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices,
  getAllUsersServices,
  getUserByIdServices,  
  updateUserServices,
  deleteUserServices,
  changePasswordServices,
};
