import { APP_CONFIG } from "./config/app.config";
import app from "./app";
import { logger } from "./utils/loggers/appLogger";
import sequelize from "./config/sequelize";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./utils/constants/constants";
import { Server } from "http";


//Start the server
const port: string = APP_CONFIG.APP_PORT || '3000';

const server: Server = app.listen(
  port,
  async (): Promise<void> => {
    logger.info(`App running on port ${port}...`);
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      logger.info(SUCCESS_MESSAGES.DB_CONNECTION_SUCCESS);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`${ERROR_MESSAGES.DB_CONNECTION_ERROR}: ${error.message}`);
      }
      logger.error(`${ERROR_MESSAGES.UNEXPECTED_ERROR}`);
      process.exit(1);
    }
  }
);

// Handle unhandled promise rejections and uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error(`${ERROR_MESSAGES.UNCAUGHT_EXCEPTION_ERROR}: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error(`${ERROR_MESSAGES.UNHANDLED_REJECTION_ERROR}: ${reason}`);
  server.close(() => {
    process.exit(1);
  });
});
