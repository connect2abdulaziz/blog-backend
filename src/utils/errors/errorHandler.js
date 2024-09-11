"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appError_js_1 = require("./appError.js");
var constants_js_1 = require("../constants/constants.js");
// Send detailed error information in development
var sendErrorDev = function (error, response) {
    var statusCode = error.statusCode || constants_js_1.STATUS_CODE.INTERNAL_SERVER_ERROR;
    var status = error.status || "error";
    var message = error.message || constants_js_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    var stack = error.stack;
    response.status(statusCode).json({
        status: status,
        message: message,
        stack: stack,
    });
};
// Send limited error information in production
var sendErrorProd = function (error, response) {
    var statusCode = error.statusCode || constants_js_1.STATUS_CODE.INTERNAL_SERVER_ERROR;
    var status = error.status || "error";
    var message = error.message || constants_js_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    if (error.isOperational) {
        return response.status(statusCode).json({
            status: status,
            message: message,
        });
    }
    // Log the detailed error information for debugging
    console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
    });
    response.status(statusCode).json({
        status: status,
        message: message,
    });
};
// Global error handling middleware
var globalErrorHandler = function (err, req, res, next) {
    if (err.name === "JsonWebTokenError") {
        err = new appError_js_1.default(constants_js_1.ERROR_MESSAGES.INVALID_TOKEN, constants_js_1.STATUS_CODE.UNAUTHORIZED);
    }
    if (err.name === "SequelizeUniqueConstraintError") {
        err = new appError_js_1.default(constants_js_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, constants_js_1.STATUS_CODE.BAD_REQUEST);
    }
    if (process.env.NODE_ENV === "development") {
        return sendErrorDev(err, res);
    }
    return sendErrorProd(err, res);
};
exports.default = globalErrorHandler;
