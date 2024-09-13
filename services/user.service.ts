// External Libraries
import bcrypt from "bcrypt";
import User from "../db/models/user.model";

// Internal Modules
import { AppError } from "../utils/errors/appError";
import { hashPassword } from "../utils/helpers/hashPasswordUtils";
import { generateToken, verifyToken } from "../utils/helpers/tokenUtils";
import { sendEmailWithToken } from "../utils/helpers/emailTokenUtils";
import {
  generateRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
} from "../utils/helpers/refreshTokenUtils";
import {
  uploadImageToCloudinary,
  generateThumbnailUrl,
  deleteImageFromCloudinary,
} from "../utils/cloudinary";

// Constants and Configuration
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants";
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  EMAIL_CONSTANTS,
} from "../utils/constants/emailTemplates";
import { UserAttributes } from "../types/model.Interfaces";
import { UserRequest, UserResponse } from "../types/app.interfaces";

const createUserServices = async ({
  firstName,
  lastName,
  email,
  password,
}: UserAttributes): Promise<UserResponse> => {
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
    const token = generateToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
    return { token, refreshToken };
  } catch (error) {
    throw error;
  }
};

const forgotPasswordServices = async (email: string): Promise<UserResponse> => {
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

    return { id: user.id };
  } catch (error) {
    throw error;
  }
};

const verifyEmailServices = async (token: string): Promise<UserResponse> => {
  try {
    const userId = verifyToken(token);
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
    return { id: user.id };
  } catch (error) {
    throw error;
  }
};

const loginUserServices = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserResponse> => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(
        ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD,
        STATUS_CODE.BAD_REQUEST
      );
    }
    if (!user.verified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return { token, refreshToken };
  } catch (error) {
    throw error;
  }
};

const resetPasswordServices = async (
  { password }: { password: string },
  token: string
): Promise<UserResponse> => {
  try {
    const userId = verifyToken(token);
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    return { id: user.id };
  } catch (error) {
    throw error;
  }
};

const getUserByIdServices = async (id: number): Promise<UserResponse> => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserServices = async (
  userId: number,
  updates: UserRequest
): Promise<UserResponse> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    await user.update(updates);
    const { password, ...cleanedResult } = user.toJSON();
    return cleanedResult;
  } catch (error) {
    throw error;
  }
};

const deleteUserServices = async (
  userId: number,
  password: string
): Promise<UserResponse> => {
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
    if (user.profilePicture) {
      const publicId = user.profilePicture
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await deleteImageFromCloudinary(publicId);
    }
    await user.destroy();
    return { id: userId };
  } catch (error) {
    throw error;
  }
};

const changePasswordServices = async (
  userId: number,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string }
): Promise<UserResponse> => {
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
    const { password, ...cleanedResult } = user.toJSON();
    return cleanedResult;
  } catch (error) {
    throw error;
  }
};

const updateUserImageServices = async (
  userId: number,
  file: { path: string }
): Promise<UserResponse> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    let imageUrl: string | null = null;
    let thumbnailUrl: string | null = null;

    if (file && file.path) {
      if (user.profilePicture) {
        const publicId = user.profilePicture
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
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
    throw error;
  }
};

const refreshTokenServices = async (token: string): Promise<UserResponse> => {
  try {
    const userId = verifyRefreshToken(token);
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    // Generate new tokens
    const newAccessToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Remove old refresh token
    removeRefreshToken(token);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Logout if token verification fails
    removeRefreshToken(token);
    throw error;
  }
};

const logoutUserServices = async (
  refreshToken: string
): Promise<UserResponse> => {
  try {
    removeRefreshToken(refreshToken);
    return {};
  } catch (error) {
    throw error;
  }
};

// Function to find a user by email
const findByEmail = async (email: string) => {
  try {
    const exists = await User.findOne({ where: { email } });
    return exists;
  } catch (error) {
    throw error;
  }
};

export {
  createUserServices,
  verifyEmailServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices,
  getUserByIdServices,
  updateUserServices,
  deleteUserServices,
  changePasswordServices,
  updateUserImageServices,
  refreshTokenServices,
  logoutUserServices,
};
