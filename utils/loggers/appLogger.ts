import { createLogger, format, transports, config, LoggerOptions } from "winston";
const { combine, label, timestamp, printf } = format;

// Define the custom format
const logFormat = printf(({ timestamp, label, level, message }: { timestamp: string; label: string; level: string; message: string }) => {
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

// Logger options (typed with LoggerOptions)
const options: LoggerOptions = {
  console: {
    level: process.env.LOG_LEVEL || "debug", // Using `process.env.LOG_LEVEL` for type safety
    handleExceptions: true,
    format: combine(
      format.colorize(),
      label({ label: process.env.NODE_ENV || "development" }),
      timestamp(),
      logFormat
    ),
  },
};

// Create logger and export it
export const logger = createLogger({
  levels: config.npm.levels,
  transports: [new transports.Console(options.console as transports.ConsoleTransportOptions)],
  exitOnError: false,
});
