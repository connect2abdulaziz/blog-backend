const express = require("express");
const app = express();
const sequelize = require("./config/database");
const appRouter = require("./routes");
const catchAsync = require("./utils/errors/catchAsync");
const AppError = require("./utils/errors/appError");
const globalErrorHandler = require("./utils/errors/errorHandler");
const { STATUS_CODE } = require("./utils/constants/constants");
const cors = require('cors');

app.use(express.json());

// Use CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Mount API routes on "/api/v1"
app.use("/api/v1", appRouter);

// Handle undefined routes
app.all("*", catchAsync(async (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server`, STATUS_CODE.NOT_FOUND));
}));

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
