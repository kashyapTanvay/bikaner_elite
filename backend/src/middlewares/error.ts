import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
