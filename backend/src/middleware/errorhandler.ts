import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, success: false });
  }
  console.error("Error:", err);
  return res
    .status(500)
    .json({ message: "Something went wrong!", success: false });
};
