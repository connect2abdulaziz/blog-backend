import express from 'express';
import sequelize from './config/database.js';
import appRouter from './routes/index.js';
import catchAsync from './utils/errors/catchAsync.js';
import AppError from './utils/errors/appError.js';
import globalErrorHandler from './utils/errors/errorHandler.js';
import { STATUS_CODE } from './utils/constants/constants.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import corsHandler from './middleware/corsHandler.js'; 

// Resolve the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger file
const swaggerFilePath = path.resolve(__dirname, 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerFilePath);

// Create Express app
const app = express();

// Serve static files (e.g., for Swagger UI)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: process.env.SWAGGER_URL,
  })
);

// Middleware setup
app.use(express.json());

// Apply CORS middleware
app.use(corsHandler); 

// Mount API routes
app.use("/api/v1", appRouter);

// Handle undefined routes
app.all("*", catchAsync(async (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, STATUS_CODE.NOT_FOUND));
}));

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

export default app;
