import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../constants/constants.js";

const { JWT_REFRESH_SECRET_KEY, JWT_REFRESH_EXPIRES_IN } = process.env;

// In-memory blacklist for invalidated tokens
const blacklist: Set<string> = new Set();

// Define the type for JWT payload
interface TokenPayload extends JwtPayload {
  userId: string;
}

// Generate a JWT refresh token
const generateRefreshToken = (userId: number): string => {
  try {
    const token = jwt.sign({ userId }, JWT_REFRESH_SECRET_KEY as string, {
      expiresIn: JWT_REFRESH_EXPIRES_IN || "7d", // Default to 7 days if not set
    });
    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Could not generate refresh token");
  }
};

// Verify a JWT refresh token
const verifyRefreshToken = (token: string): string => {
  if (blacklist.has(token)) {
    throw new AppError(
      ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      STATUS_CODE.UNAUTHORIZED
    );
  }
  try {
    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET_KEY as string
    ) as TokenPayload;
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    throw new AppError(
      ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      STATUS_CODE.UNAUTHORIZED
    );
  }
};

// Remove a JWT refresh token by adding it to the blacklist
const removeRefreshToken = (token: string): void => {
  blacklist.add(token);
};

export { generateRefreshToken, verifyRefreshToken, removeRefreshToken };
