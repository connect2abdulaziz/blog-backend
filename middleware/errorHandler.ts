import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/appError";
import { STATUS_CODE, ERROR_MESSAGES } from "../utils/constants/constants";
import { APP_CONFIG } from "../config/app.config";

// Send detailed error information in development
const sendErrorDev = (error: AppError, res: Response) => {
  const statusCode = error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
  const status = error.name || "error";
  const message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  const stack = error.stack;

  res.status(statusCode).json({
    status,
    message,
    stack,
    error,
  });
};

// Send limited error information in production
const sendErrorProd = (error: AppError, res: Response) => {
  const statusCode = error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
  const status = error.name || "error";
  const message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // If the error is operational, send safe error details
  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  // For non-operational errors, log detailed info and send generic message
  console.error("Error details:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });

  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

// Specific error handling for common errors
const handleSpecificErrors = (err: any) => {
  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return new AppError(
      ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      STATUS_CODE.BAD_REQUEST
    );
  }

  // Handle Sequelize connection errors
  if (err.name === "SequelizeConnectionError") {
    return new AppError(
      ERROR_MESSAGES.DB_CONNECTION_ERROR,
      STATUS_CODE.SERVICE_UNAVAILABLE
    );
  }

  // Handle Validation Errors (e.g., from Joi, Yup, or similar)
  if (err.name === "ValidationError") {
    // Extract details from validation errors
    const message = Object.values(err.errors)
      .map((el: any) => el.message)
      .join(", ");
    return new AppError(message, STATUS_CODE.BAD_REQUEST);
  }

  return err;
};

// Global error handling middleware
const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err = handleSpecificErrors(err);

  if (APP_CONFIG.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  sendErrorProd(err, res);
};

export default globalErrorHandler;
