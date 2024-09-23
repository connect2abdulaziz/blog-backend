"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/errors/appError");
const constants_1 = require("../utils/constants/constants");
const app_config_1 = require("../config/app.config");
// Send detailed error information in development
const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR;
    const status = error.name || "error";
    const message = error.message || constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    const stack = error.stack;
    res.status(statusCode).json({
        status,
        message,
        stack,
        error,
    });
};
// Send limited error information in production
const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR;
    const status = error.name || "error";
    const message = error.message || constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
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
    res.status(constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
};
// Specific error handling for common errors
const handleSpecificErrors = (err) => {
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return new appError_1.AppError(constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.STATUS_CODE.UNAUTHORIZED);
    }
    // Handle Sequelize unique constraint errors
    if (err.name === "SequelizeUniqueConstraintError") {
        return new appError_1.AppError(constants_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, constants_1.STATUS_CODE.BAD_REQUEST);
    }
    // Handle Sequelize connection errors
    if (err.name === "SequelizeConnectionError") {
        return new appError_1.AppError(constants_1.ERROR_MESSAGES.DB_CONNECTION_ERROR, constants_1.STATUS_CODE.SERVICE_UNAVAILABLE);
    }
    // Handle Validation Errors (e.g., from Joi, Yup, or similar)
    if (err.name === "ValidationError") {
        // Extract details from validation errors
        const message = Object.values(err.errors)
            .map((el) => el.message)
            .join(", ");
        return new appError_1.AppError(message, constants_1.STATUS_CODE.BAD_REQUEST);
    }
    return err;
};
// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
    err = handleSpecificErrors(err);
    if (app_config_1.APP_CONFIG.NODE_ENV === "development") {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
};
exports.default = globalErrorHandler;
