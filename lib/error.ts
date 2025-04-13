export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("An unexpected error occurred");
}

export const ERROR_MESSAGES = {
  NOT_FOUND: "The requested resource was not found",
  UNAUTHORIZED: "You must be logged in to access this resource",
  FORBIDDEN: "You do not have permission to access this resource",
  VALIDATION: "The provided data is invalid",
  INTERNAL: "An internal server error occurred",
} as const;
