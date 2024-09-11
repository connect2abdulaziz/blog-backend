// External Libraries
import bcrypt from "bcrypt";
import { Request } from "express";

// Internal Modules
import User from "../.vscode/db/models/user.js";
import AppError from "../controllers/utils/errors/appError.js";
import { hashPassword } from "../controllers/utils/helpers/hashPasswordUtils.js";
import {
  generateToken,
  verifyToken,
} from "../controllers/utils/helpers/tokenUtils.js";
import { sendEmailWithToken } from "../controllers/utils/helpers/emailTokenUtils.js";
import {
  generateRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
} from "../controllers/utils/helpers/refreshTokenUtils.js";
import {
  uploadImageToCloudinary,
  generateThumbnailUrl,
  deleteImageFromCloudinary,
} from "../../controllers/utils/cloudinary.js";

// Constants and Configuration
import {
  ERROR_MESSAGES,
  STATUS_CODE,
} from "../controllers/utils/constants/constants.js";
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  EMAIL_CONSTANTS,
} from "../controllers/utils/constants/emailTemplates.js";
import { UserAttributes } from "../.vscode/db/models/modelInterfaces.js";
import { UserRequest, UserResponse } from "./interfaces.js";

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
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const forgotPasswordServices = async (email: string) => {
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
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    return user;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    return user;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    return user;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    return user;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    throw new AppError(
      error.message || ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      STATUS_CODE.UNAUTHORIZED
    );
  }
};

const logoutUserServices = async (refreshToken: string) => {
  try {
    removeRefreshToken(refreshToken);
    return { message: "Logged out successfully" };
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Function to find a user by email
const findByEmail = async (email: string) => {
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
  getUserByIdServices,
  updateUserServices,
  deleteUserServices,
  changePasswordServices,
  updateUserImageServices,
  refreshTokenServices,
  logoutUserServices,
};
