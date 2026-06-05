import type { RequestHandler } from "express";
import { errorResponse } from "../types/api.js";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json(
    errorResponse({
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} was not found.`,
      retryable: false
    })
  );
};
