class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message); // Call the parent `Error` constructor with the message
      this.statusCode = statusCode;
      
      // Determine if the error is a client-side error (4xx) or server-side (5xx)
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      // Capture stack trace, excluding constructor call from it
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;
  