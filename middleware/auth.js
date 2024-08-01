
require("dotenv").config({ path: `${process.cwd()}/.env` });
const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { STATUS_CODE, ERROR_MESSAGES } = require("../utils/constants");

// Function to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Middleware for authentication
const authentication = catchAsync(async (req, res, next) => {
  // 1. Get the token from header
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED));
  }

  // 2. Token verification
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  // Get the user information from the DB and add them to the req object
  const freshUser = await user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.BAD_REQUEST));
  }
  req.user = freshUser;
  console.log(req.user);
  return next();
});

// Middleware to restrict access to certain user types
const restrictTo = (...userTypes) => {
  const checkPermission = (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return next(new AppError(ERROR_MESSAGES.FORBIDDEN, STATUS_CODE.FORBIDDEN));
    }
    return next();
  };
  return checkPermission;
};

module.exports = { generateToken, authentication, restrictTo };
