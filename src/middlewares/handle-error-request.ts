import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const handleErrorRequest: ErrorRequestHandler = (err, req, res, next) => {
  let message = err.message || 'Internal Server Error';
  let statusCode = err.statusCode || 500;

  if (err instanceof Error) {
    message = err.message || message;
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    const issue = err.issues.at(0);
    if (issue) {
      let zodmessage = `${issue.path}: ${issue.message}`;
      if (zodmessage.startsWith(':')) {
        zodmessage = zodmessage.slice(2);
      }
      message = zodmessage || message;
    }
  }
  res.status(statusCode).json({ message });
};
