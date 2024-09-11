import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/user";
import catchAsync from "../utils/errors/catchAsync";
import AppError from "../utils/errors/appError";
import { STATUS_CODE, ERROR_MESSAGES } from "../utils/constants/constants";

// Load environment variables from .env file
dotenv.config({ path: `${process.cwd()}/.env` });

// Middleware for authentication
const authentication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get the token from the header
    let idToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
      return next(
        new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED)
      );
    }

    // 2. Token verification
    const tokenDetail = jwt.verify(
      idToken,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    // Get the user information from the DB and add them to the req object
    const freshUser = await User.findByPk(tokenDetail.id);

    if (!freshUser) {
      return next(
        new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.BAD_REQUEST)
      );
    }

    // Set user ID on the req object
    req.userId = freshUser.id;

    return next();
  }
);

export { authentication };
