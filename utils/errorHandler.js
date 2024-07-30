const AppError = require('./appError');

// Send detailed error information in development
const sendErrorDev = (error, response) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message || 'Something went wrong';
    const stack = error.stack;

    response.status(statusCode).json({
        status,
        message,
        stack,
    });
};

// Send limited error information in production
const sendErrorProd = (error, response) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message || 'Something went wrong';

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
        err = new AppError('Invalid token', 401);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError('Email already registered', 400);
    }
    
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    return sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
