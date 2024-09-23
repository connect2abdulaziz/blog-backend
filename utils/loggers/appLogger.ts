import { createLogger, format, transports, config } from "winston";
import { TransformableInfo } from "logform"; 
import { APP_CONFIG } from "../../config/app.config";

const { combine, label, timestamp, printf } = format;

// Define the custom format using TransformableInfo
const logFormat = printf(({ timestamp, label, level, message }: TransformableInfo) => {
  const formattedTimestamp = new Date(timestamp as string).toLocaleString("en-US", {
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
export const logger = createLogger({
  levels: config.npm.levels,
  format: combine(
    format.colorize(),
    label({ label: APP_CONFIG.NODE_ENV || "development" }),
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: APP_CONFIG.LOG_LEVEL || "debug",
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});
