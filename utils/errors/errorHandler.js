const AppError = require('./appError');
const { STATUS_CODE, ERROR_MESSAGES } = require('../constants/constants');

// Send detailed error information in development
const sendErrorDev = (error, response) => {
    const statusCode = error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
    const status = error.status || 'error';
    const message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    const stack = error.stack;

    response.status(statusCode).json({
        status,
        message,
        stack,
    });
};

// Send limited error information in production
const sendErrorProd = (error, response) => {
    const statusCode = error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
    const status = error.status || 'error';
    const message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (error.isOperational) {
        return response.status(statusCode).json({
            status,
            message,
        });
    }

    // Log the detailed error information for debugging
    console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
    });

    response.status(statusCode).json({
        status,
        message,
    });
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
    if (err.name === 'JsonWebTokenError') {
        err = new AppError(ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
    }

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    return sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
