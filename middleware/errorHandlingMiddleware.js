import ApiError from "../error/apiError.js";

export function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.status).json(err.message);
  } else {
    res.status(500).json({ message: `Unhandled error:  ${err.message}` });
  }
}
