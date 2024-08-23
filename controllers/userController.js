import catchAsync from '../utils/errors/catchAsync.js';
import AppError from '../utils/errors/appError.js';
import appSuccess from '../utils/errors/appSuccess.js';
import {
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  changePasswordSchema,
} from '../utils/validations/userValidator.js';
import {
  createUserServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices,
  verifyEmailServices,
  getAllUsersServices,
  getUserByIdServices,
  updateUserServices,
  deleteUserServices,
  changePasswordServices,
  updateUserImageServices,
} from '../services/userService.js';
import {
  STATUS_CODE,
  SUCCESS_MESSAGES,
} from '../utils/constants/constants.js';


// Signup Controller
const signup = catchAsync(async (req, res, next) => {
  // Validate the input data
  const { error, value } = userSchema.validate(req.body);
  if (error)
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  const result = await createUserServices(value);
  return res
    .status(STATUS_CODE.CREATED)
    .json(appSuccess(SUCCESS_MESSAGES.USER_CREATED, result));
});

// verify the user email
const verifyEmail = catchAsync(async (req, res, next) => {
  console.log("verifyEmail");
  const { token } = req.params;
  const result = await verifyEmailServices(token);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.EMAIL_VERIFIED, result));
});

// Login Controller
const login = catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error)
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  const token = await loginUserServices(value);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.USER_LOGGED_IN, token));
});

// Forgot Password
const forgotPassword = catchAsync(async (req, res, next) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error)
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  const result = await forgotPasswordServices(value);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT, result));
});

// Reset Password
const resetPassword = catchAsync(async (req, res, next) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error)
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  const { token } = req.params;
  const result = await resetPasswordServices(value, token);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS, result));
});

// Get All Users Controller
const getAllUsers = catchAsync(async (req, res, next) => {
  console.log("GET ALL");
  const users = await getAllUsersServices();
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.USER_FETCHED, users));
});

// Get User By ID Controller
const getUserById = catchAsync(async (req, res, next) => {
  console.log("Getting user by ID");
  const { id } = req.params;
  const user = await getUserByIdServices(id);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.USER_FETCHED, user));
});

// Update User Controller
const updateUser = catchAsync(async (req, res, next) => {
  const { error, value } = updateUserSchema.validate(req.body);
  if (error)
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  const { id: userId } = req.user;
  const updatedUser = await updateUserServices(userId, value);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.USER_UPDATED, updatedUser));
});

// Delete User Controller
const deleteUser = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  await deleteUserServices(userId);
  return res.json(appSuccess(SUCCESS_MESSAGES.USER_DELETED, userId));
});

// Change Password Controller
const changePassword = catchAsync(async (req, res, next) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  }
  const { id: userId } = req.user;
  await changePasswordServices(userId, value);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.PASSWORD_CHANGED));
});

// Upload User Image Controller
const updateImage = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await updateUserImageServices(userId, req.file);
  return res
   .status(STATUS_CODE.OK)
   .json(appSuccess(SUCCESS_MESSAGES.USER_IMAGE_UPDATED, result));
});

// Logout Controller
const logout = catchAsync(async (req, res, next) => {
  return res.status(STATUS_CODE.OK).json({
    status: "success",
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  });
});

export {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateImage,
  logout,
};
