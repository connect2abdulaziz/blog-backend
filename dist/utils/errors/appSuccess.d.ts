import { SuccessResponse } from "../../types/app.interfaces";
declare function appSuccess<T>(message: string, data: T): SuccessResponse<T>;
export default appSuccess;
