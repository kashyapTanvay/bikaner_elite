import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserEnums } from "../enums";
import { UserInterfaces } from "../interfaces";

// Extend the Express Request interface
declare global {
  namespace Express {
    interface User extends UserInterfaces.User {}
    interface Request {
      user?: UserInterfaces.User;
    }
  }
}

export const AuthenticateAndAuthorize = (
  allowedRoles: UserEnums.UserRole[] = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use passport.authenticate as middleware
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: UserInterfaces.User | false, info: any) => {
        if (err) {
          console.error("Passport authentication error:", err);
          return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: err.message,
          });
        }

        // Case 1: No token provided
        if (!user) {
          // If allowedRoles is empty, allow unauthenticated access
          if (allowedRoles.length === 0) {
            return next();
          }
          // If roles are required but no user, return unauthorized
          return res.status(401).json({
            success: false,
            message: "Authentication required",
          });
        }

        // Case 2: We have a valid user
        // Attach user to request
        req.user = user;

        // If allowedRoles is empty, allow all authenticated users
        if (allowedRoles.length === 0) {
          return next();
        }

        // Check if user's role is in allowedRoles
        if (!allowedRoles.includes(user.role as UserEnums.UserRole)) {
          return res.status(403).json({
            success: false,
            message: "Insufficient permissions",
          });
        }

        // User has required role
        return next();
      }
    )(req, res, next);
  };
};
