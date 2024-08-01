const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const { 
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  // updatePasswordSchema,
  // updateUserSchema,
  // updateUserProfileSchema,
 } = require("../utils/validators/userValidator");
const { 
  createUserServices,
  loginUserServices,
  forgotPasswordServices,
  resetPasswordServices
} = require("../services/userService");

const { STATUS_CODE, SUCCESS_MESSAGES } = require("../utils/constants");

// Signup Controller
const signup = catchAsync(async (req, res, next) => {
  // Validate the input data
  const { error, value } = userSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  const result = await createUserServices(value);
  return res.status(STATUS_CODE.CREATED).json(appSuccess(SUCCESS_MESSAGES.USER_CREATED, result));
});


// Login Controller
const login = catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  const token = await loginUserServices(value);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.USER_LOGGED_IN, token));
});


// Forgot Password
const forgotPassword = catchAsync(async (req, res, next) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  const result = await forgotPasswordServices(value);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT, result));
});


// Reset Password
const resetPassword = catchAsync(async (req, res, next) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  const { token } = req.params;
  const result = await resetPasswordServices(value, token);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS, result));
});

module.exports = { signup, login, forgotPassword, resetPassword };
