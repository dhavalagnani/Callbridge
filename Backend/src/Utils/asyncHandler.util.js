const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error("Unhandled Promise Rejection:", error);
    next(error);
  });
};

export default asyncHandler;
