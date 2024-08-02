function appSuccess(message, data = {}) {
  return {
    status: "success",
    message: message,
    data: data,
  };
}

module.exports = appSuccess;
