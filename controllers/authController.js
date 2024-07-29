const user = require("../db/models/user");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const { userSchema } = require("../utils/validators/userValidator");
const { createUser, findByEmail } = require("../services/userService");
const { generateToken } = require("../utils/authUtils");

const signup = catchAsync(async (req, res, next) => {
  // validate the input data
  const { error, value } = userSchema.validate(req.body);
  if (error) 
    return next(new AppError(error.details[0].message, 400));
  const { firstName, lastName, email, password } = value;
  
  const result = await createUser({firstName,lastName,email,password});
  return res.status(200).json(appSuccess("User created successfully", result));
  
});



const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const result = await user.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Invalid email or password", 400));
  }
  const token = generateToken({
    id: result.id,
  });
  return res.status(200).json(appSuccess("User logged in successfully", token));
});

module.exports = { signup, login };
