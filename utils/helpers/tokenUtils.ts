import jwt, { JwtPayload } from "jsonwebtoken";
import { APP_CONFIG } from "../../config/app.config";
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = APP_CONFIG;

// Define a type for the token payload
interface TokenPayload extends JwtPayload {
  userId: string;
}


// Generate a JWT token
const generateToken = (userId: number): string => {
  try {
    return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Could not generate token");
  }
};

// Verify a JWT token and return the userId
const verifyToken = (token: string): number => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as TokenPayload;
    const { userId } = decoded;
    return parseInt(userId, 10);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
};

export { generateToken, verifyToken };
