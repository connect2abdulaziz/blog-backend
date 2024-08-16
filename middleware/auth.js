import dotenv from 'dotenv';
import User from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/errors/catchAsync.js';
import AppError from '../utils/errors/appError.js';
import { STATUS_CODE, ERROR_MESSAGES } from '../utils/constants/constants.js';

// Load environment variables from .env file
dotenv.config({ path: `${process.cwd()}/.env` });

// Middleware for authentication
const authentication = catchAsync(async (req, res, next) => {
  // 1. Get the token from header
  let idToken = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    idToken = req.headers.authorization.split(' ')[1];
  }
  if (!idToken) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED)
    );
  }

  // 2. Token verification
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  // Get the user information from the DB and add them to the req object
  const freshUser = await User.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(
      new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.BAD_REQUEST)
    );
  }
  req.user = freshUser;
  return next();
});

export { authentication };
