const user = require("../db/models/user");
const bcrypt = require("bcrypt");
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

const {STATUS_CODE}=require("../utils/constants");


//Signup Controller
const signup = catchAsync(async (req, res, next) => {
  // validate the input data
  const { error, value } = userSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, 400));
  const result = await createUserServices(value);
  return res.status(STATUS_CODE.CREATED).json(appSuccess("User created successfully", result));
});


//Login Controller
const login = catchAsync(async (req, res, next) => {
  const {error, value} = loginSchema.validate(req.body);
  if(error) 
    return next(new AppError(error.details[0].message, 400));
  const token = await loginUserServices(value);
  return res.status(200).json(appSuccess("User logged in successfully", token));
});


//forgot Password
const forgotPassword = catchAsync(async (req, res, next) => {
  const {error, value} = forgotPasswordSchema.validate(req.body);
  if(error)
    return next(new AppError(error.details[0].message, 400));
  const result = await forgotPasswordServices(value);
  return res.status(200).json(appSuccess("Password reset email sent successfully", result));
});

//reset password
const resetPassword = catchAsync(async (req, res, next) => {
  const {error, value} = resetPasswordSchema.validate(req.body);
  if(error)
    return next(new AppError(error.details[0].message, 400));
  const {token} = req.params;
  const result = await resetPasswordServices(value, token);
  return res.status(200).json(appSuccess("Password reset successfully", result));
});

module.exports = { signup, login, forgotPassword, resetPassword};
