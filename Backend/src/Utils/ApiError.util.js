export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// export default { ApiError, NotFoundError, ValidationError };
