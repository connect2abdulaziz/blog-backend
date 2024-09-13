import { SuccessResponse } from "../../types/app.interfaces";
function appSuccess<T>(message: string, data: T): SuccessResponse<T> {
  return {
    status: "success",
    message: message,
    data: data,
  };
}

export default appSuccess;
