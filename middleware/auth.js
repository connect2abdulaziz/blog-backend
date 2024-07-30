const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from header
    let idToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
      return next(new AppError("Please login to get access", 401));
    }
  
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  
    // get the user information from db and add them to the req object
    const freshUser = await user.findByPk(tokenDetail.id);
  
    if (!freshUser) {
      return next(new AppError("User no longer exists", 400));
    }
    req.user = freshUser;
    console.log(req.user);
    return next();
  });
  
  const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
      if (!userType.includes(req.user.userType)) {
        return next(
          new AppError("You don't have permission to perform this action", 403)
        );
      }
      return next();
    };
    return checkPermission;
  };

  module.exports = { generateToken, authentication, restrictTo };