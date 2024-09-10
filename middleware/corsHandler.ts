// middleware/corsHandler.js
import cors from 'cors';

const corsHandler = cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsHandler;
