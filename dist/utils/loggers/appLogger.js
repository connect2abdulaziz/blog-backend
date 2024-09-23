"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const app_config_1 = require("../../config/app.config");
const { combine, label, timestamp, printf } = winston_1.format;
// Define the custom format using TransformableInfo
const logFormat = printf(({ timestamp, label, level, message }) => {
    const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    return `${formattedTimestamp} [${label}] ${level}: ${message}`;
});
// Create logger and export it
exports.logger = (0, winston_1.createLogger)({
    levels: winston_1.config.npm.levels,
    format: combine(winston_1.format.colorize(), label({ label: app_config_1.APP_CONFIG.NODE_ENV || "development" }), timestamp(), logFormat),
    transports: [
        new winston_1.transports.Console({
            level: app_config_1.APP_CONFIG.LOG_LEVEL || "debug",
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
//# sourceMappingURL=appLogger.js.map