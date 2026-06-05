import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, errorResponse } from "../types/api.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json(
      errorResponse({
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        retryable: false
      })
    );
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      errorResponse({
        code: error.code,
        message: error.message,
        retryable: error.retryable
      })
    );
    return;
  }

  res.status(500).json(
    errorResponse({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error.",
      retryable: false
    })
  );
};
