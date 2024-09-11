type AppSuccessResponse<T> = {
  status: "success";
  message: string;
  data: T;
};

function appSuccess<T>(message: string, data: T): AppSuccessResponse<T> {
  return {
    status: "success",
    message: message,
    data: data,
  };
}

export default appSuccess;
