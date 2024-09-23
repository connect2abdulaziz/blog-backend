import morgan, { StreamOptions } from "morgan";
import {logger} from "./appLogger"; 
import { SUCCESS_MESSAGES } from "../constants/constants"; 
import json from "morgan-json";

// Define the JSON format for morgan
const format = json({
  method: ":method",
  url: ":url",
  status: ":status",
  contentLength: ":res[content-length]",
  responseTime: ":response-time",
});

// Define the stream options for morgan
const stream: StreamOptions = {
  write: (message: string) => {
    try {
      const { method, url, status, contentLength, responseTime } = JSON.parse(
        message
      );

      logger.info(
        ` ************* ${SUCCESS_MESSAGES.HTTPS_REQUEST} *************
        TIMESTAMP = ${new Date().toString()} 
        METHOD = ${method} 
        URL = ${url} 
        STATUS = ${Number(status)} 
        CONTENT-LENGTH = ${contentLength} bytes 
        RESPONSE-TIME = ${responseTime} ms`
      );
    } catch (error) {
      logger.error("Error parsing morgan log message: ", error);
    }
  },
};

// Create the morgan HTTP logger
export const httpLogger = morgan(format, { stream });

