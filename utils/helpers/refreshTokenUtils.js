import crypto from "crypto";
import AppError from "../errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../constants/constants.js";

const tokens = new Map(); // In-memory storage for tokens

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  // Store the token in memory
  tokens.set(token, { userId, expiresAt });

  return token;
};

const verifyRefreshToken = async (token) => {
  const tokenData = tokens.get(token);

  if (!tokenData || tokenData.expiresAt < Date.now()) {
    throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  return { token, userId: tokenData.userId };
};

const removeRefreshToken = async (token) => {
  tokens.delete(token);
};

export { generateRefreshToken, verifyRefreshToken, removeRefreshToken };
