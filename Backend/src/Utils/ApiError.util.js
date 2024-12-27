class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends ApiError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export default { ApiError, NotFoundError, ValidationError };
