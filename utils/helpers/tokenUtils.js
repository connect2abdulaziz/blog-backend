// utils/helpers/tokenUtils.js

import jwt from 'jsonwebtoken';
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Could not generate token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};

export {
  generateToken,
  verifyToken,
};
