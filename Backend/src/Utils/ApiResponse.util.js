class ApiResponse {
  static success(res, message, data = {}) {
    return res.status(200).json({
      status: "success",
      message,
      data,
    });
  }

  static created(res, message, data = {}) {
    return res.status(201).json({
      status: "success",
      message,
      data,
    });
  }

  static error(res, message, statusCode = 500, error = null) {
    return res.status(statusCode).json({
      status: "error",
      message,
      error,
    });
  }

  static notFound(res, message) {
    return res.status(404).json({
      status: "error",
      message,
    });
  }

  static validationError(res, message) {
    return res.status(400).json({
      status: "error",
      message,
    });
  }
}

export default ApiResponse;
