import ApiError from "../error/apiError.js";
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    if (req.method === "OPTIONS") {
      next();
    }

    const authorization = req.headers?.authorization || null;

    if (!authorization) {
      return next(ApiError.unauthorized("Not provided token authorization"));
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next(ApiError.unauthorized("Not provided token"));
    }

    const decodedData = jwt.verify(token, process.env.JWT_CRYPTO_KEY);

    req.user = decodedData;
    next();
  } catch (error) {
    return next(ApiError.unauthorized(error.message));
  }
}
