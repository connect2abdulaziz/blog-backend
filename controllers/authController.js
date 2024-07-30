const user = require("../db/models/user");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const { userSchema,loginSchema  } = require("../utils/validators/userValidator");
const { createUser, loginUser } = require("../services/userService");

//Signup Controller
const signup = catchAsync(async (req, res, next) => {
  // validate the input data
  const { error, value } = userSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, 400));
  const { firstName, lastName, email, password } = value;
  const result = await createUser({firstName,lastName,email,password});
  return res.status(200).json(appSuccess("User created successfully", result));
});


//Login Controller
const login = catchAsync(async (req, res, next) => {
  const {error, value} = loginSchema.validate(req.body);
  if(error) 
    return next(new AppError(error.details[0].message, 400));
  const { email, password } = value;
  const token = await loginUser({email, password});
  return res.status(200).json(appSuccess("User logged in successfully", token));
});

module.exports = { signup, login };
