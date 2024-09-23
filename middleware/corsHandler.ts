// middleware/corsHandler.js
import cors from 'cors';

// Apply CORS middleware to all routes
const corsHandler = cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsHandler;
