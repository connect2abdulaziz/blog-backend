// External Libraries
import bcrypt from "bcrypt";

// Internal Modules
import User from "../db/models/user.js";
import AppError from "../utils/errors/appError.js";
import { hashPassword } from "../utils/helpers/hashPasswordUtils.js";
import { generateToken, verifyToken } from "../utils/helpers/tokenUtils.js";
import { sendEmailWithToken } from "../utils/helpers/emailTokenUtils.js";
import {
  uploadImageToCloudinary,
  generateThumbnailUrl,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

// Constants and Configuration
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants.js";
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  EMAIL_CONSTANTS,
} from "../utils/constants/emailTemplates.js";

const createUserServices = async ({ firstName, lastName, email, password }) => {
  try {
    const alreadyRegistered = await findByEmail(email);
    if (alreadyRegistered) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.BAD_REQUEST
      );
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verified: false,
    });
    await sendEmailWithToken({
      userId: newUser.id,
      email,
      subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
      textTemplate: EMAIL_TEMPLATES.EMAIL_VERIFICATION.text,
      htmlTemplate: EMAIL_TEMPLATES.EMAIL_VERIFICATION.html,
      endpoint: EMAIL_CONSTANTS.VERIFY_EMAIL_ENDPOINT,
      tokenExpiresIn: EMAIL_CONSTANTS.VERIFY_EMAIL_TOKEN_EXPIRATION,
    });

    const {
      password: pass,
      profilePicture,
      thumbnail,
      ...cleanedResult
    } = newUser.toJSON();
    cleanedResult.token = generateToken({ id: newUser.id });
    return cleanedResult;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const forgotPasswordServices = async ({ email }) => {
  try {
    const user = await findByEmail(email);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    await sendEmailWithToken({
      userId: user.id,
      email,
      subject: EMAIL_SUBJECTS.PASSWORD_RESET,
      textTemplate: EMAIL_TEMPLATES.PASSWORD_RESET.text,
      htmlTemplate: EMAIL_TEMPLATES.PASSWORD_RESET.html,
      endpoint: EMAIL_CONSTANTS.RESET_PASSWORD_ENDPOINT,
      tokenExpiresIn: EMAIL_CONSTANTS.RESET_PASSWORD_TOKEN_EXPIRATION,
    });

    return user.id;
  } catch (error) {
    throw new AppError(
      error.message ||
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const verifyEmailServices = async (token) => {
  try {
    const { userId } = verifyToken(token);
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (user.verified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        STATUS_CODE.BAD_REQUEST
      );
    }
    await User.update({ verified: true }, { where: { id: user.id } });
    return user.id;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const loginUserServices = async ({ email, password }) => {
  try {
    const user = await findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(
        ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const { password: _, ...cleanedUser } = user.dataValues;
    const token = generateToken({ id: user.id });
    return { ...cleanedUser, token };
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPasswordServices = async ({ password }, token) => {
  try {
    const { userId } = verifyToken(token);
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    return user.id;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllUsersServices = async () => {
  try {
    return await User.findAll({ attributes: { exclude: ["password"] } });
  } catch (error) {
    throw new AppError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const getUserByIdServices = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return user;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserServices = async (userId, updates) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    await user.update(updates);
    const { password, ...cleanedResult } = user.toJSON();
    return cleanedResult;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUserServices = async (userId, password) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(
        ERROR_MESSAGES.INCORRECT_PASSWORD,
        STATUS_CODE.BAD_REQUEST
      );
    }
    if (user.profilePicture){
      const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
      await deleteImageFromCloudinary(publicId);
    }
    await user.destroy();
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const changePasswordServices = async (
  userId,
  { currentPassword, newPassword }
) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError(
        ERROR_MESSAGES.INCORRECT_OLD_PASSWORD,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return user.id;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserImageServices = async (userId, file) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    let imageUrl = null;
    let thumbnailUrl = null;

    if (file && file.path) {

      if (user.profilePicture) {
        const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
        await deleteImageFromCloudinary(publicId);
      }

      // Upload the image to Cloudinary
      imageUrl = await uploadImageToCloudinary(file.path);
      // Extract the public ID from the image URL
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      // Generate the thumbnail URL
      thumbnailUrl = generateThumbnailUrl(publicId);
    }
    user.thumbnail = thumbnailUrl;
    user.profilePicture = imageUrl;
    await user.save();
    const { password, ...cleanedResult } = user.toJSON();
    return cleanedResult;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Function to find a user by email
const findByEmail = async (email) => {
  try {
    const exists = await User.findOne({ where: { email } });
    return exists;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.USER_NOT_FOUND,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export {
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
  updateUserImageServices,
};
