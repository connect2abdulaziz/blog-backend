import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/errors/catchAsync";
import { AppError } from "../utils/errors/appError";
import appSuccess from "../utils/errors/appSuccess";
import {
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../utils/validations/user.validator";
import {
  createUserServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices,
  verifyEmailServices,
  getUserByIdServices,
  updateUserServices,
  deleteUserServices,
  changePasswordServices,
  updateUserImageServices,
  refreshTokenServices,
  logoutUserServices,
} from "../services/user.service";
import { STATUS_CODE, SUCCESS_MESSAGES } from "../utils/constants/constants";

import {
  SuccessResponse,
  UserResponse,
  AuthRequest,
  ITokenRequest,
} from "../types/app.interfaces";

// Signup Controller
const signup = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const result = await createUserServices(value);
    return res
      .status(STATUS_CODE.CREATED)
      .json(appSuccess(SUCCESS_MESSAGES.USER_CREATED, result));
  }
);

// Verify Email Controller
const verifyEmail = catchAsync(
  async (
    req: Request<{ token: string }>,
    res: Response,
    _next: NextFunction
  ) => {
    const { token } = req.params;
    const result = await verifyEmailServices(token);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.EMAIL_VERIFIED, result));
  }
);

// Login Controller
const login = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const token = await loginUserServices(value);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.USER_LOGGED_IN, token));
  }
);

// Forgot Password Controller
const forgotPassword = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const { email } = value as { email: string };
    const result = await forgotPasswordServices(email);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT, result));
  }
);

// Reset Password Controller
const resetPassword = catchAsync(
  async (
    req: Request<{ token: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const { token } = req.params;
    const result = await resetPasswordServices(value, token);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS, result));
  }
);

// Get User By ID Controller
const getUserById = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    console.log("Getting current user...");
    const userId: number = req.userId!;
    console.log(userId);
    if (!userId) {
      throw next(new AppError("User not found", STATUS_CODE.NOT_FOUND));
    }
    const user = await getUserByIdServices(userId);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.USER_FETCHED, user));
  }
);

// Update User Controller
const updateUser = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const userId: number = req.userId!;
    if (!userId) {
      throw next(new AppError("User not found", STATUS_CODE.NOT_FOUND));
    }
    const updatedUser = await updateUserServices(userId, value);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.USER_UPDATED, updatedUser));
  }
);

// Delete User Controller
const deleteUser = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const userId: number = req.userId!;
    const { password } = req.body;
    if (!userId) {
      throw next(new AppError("User not found", STATUS_CODE.NOT_FOUND));
    }
    await deleteUserServices(userId, password);
    return res.json(appSuccess(SUCCESS_MESSAGES.USER_DELETED, userId));
  }
);

// Change Password Controller
const changePassword = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const userId: number = req.userId!;
    await changePasswordServices(userId, value);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_CHANGED, []));
  }
);

// Upload User Image Controller
const updateImage = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const userId: number = req.userId!;
    if (!userId || !req.file) {
      throw next(
        new AppError(
          "User not found or no file uploaded",
          STATUS_CODE.BAD_REQUEST
        )
      );
    }
    const result = await updateUserImageServices(userId, req.file);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.USER_IMAGE_UPDATED, result));
  }
);

// Refresh Token Controller
const refreshToken = catchAsync(
  async (
    req: ITokenRequest,
    res: Response,
    _next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { token } = req.body;
    const tokens = await refreshTokenServices(token);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.REFRESH_TOKEN, tokens));
  }
);

// Logout Controller
const logout = catchAsync(
  async (
    req: ITokenRequest,
    res: Response,
    _next: NextFunction
  ): Promise<Response<SuccessResponse<UserResponse>>> => {
    const { token } = req.body;
    await logoutUserServices(token);
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.LOGOUT_SUCCESS, {}));
  }
);

export {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateImage,
  refreshToken,
  logout,
};
