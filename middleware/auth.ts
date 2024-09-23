import { Response, NextFunction } from "express";
import User from "../db/models/user.model";
import catchAsync from "../utils/errors/catchAsync";
import { AppError } from "../utils/errors/appError";
import { STATUS_CODE, ERROR_MESSAGES } from "../utils/constants/constants";
import { AuthRequest } from "../types/app.interfaces";
import { verifyToken } from "../utils/helpers/tokenUtils";

// Middleware for authentication
const authentication = catchAsync(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    // 1. Get the token from the header
    let idToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
      throw next(
        new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED)
      );
    }
    const userId = verifyToken(idToken);
    // Get the user information from the DB and add them to the req object
    const freshUser = await User.findByPk(userId);
    if (!freshUser) {
      throw next(
        new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.BAD_REQUEST)
      );
    }
    // Set user ID on the req object
    req.userId = freshUser.id;
    return next();
  }
);

export { authentication };
