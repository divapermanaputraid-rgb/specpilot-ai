import type { NextFunction, Request, Response } from "express";
import type { ApiError, ApiResponse } from "@specpilot/types";

export type ApiRequestHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export class AppError extends Error {
  statusCode: number;
  code: string;
  retryable: boolean;
  details?: unknown;

  constructor(message: string, options: { statusCode?: number; code?: string; retryable?: boolean; details?: unknown } = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? "INTERNAL_SERVER_ERROR";
    this.retryable = options.retryable ?? false;
    this.details = options.details;
  }
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null
  };
}

export function errorResponse(error: ApiError): ApiResponse<never> {
  return {
    success: false,
    data: null,
    error
  };
}
