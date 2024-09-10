import jwt, { JwtPayload } from 'jsonwebtoken';

// Ensure environment variables are typed
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env as {
  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;
};

// Define a type for the token payload
interface TokenPayload extends JwtPayload {
  userId: string;
}

// Generate a JWT token
const generateToken = (userId: number): string => {
  try {
    return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Could not generate token');
  }
};

// Verify a JWT token and return the userId
const verifyToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as TokenPayload;
    return decoded.userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};

export {
  generateToken,
  verifyToken,
};
