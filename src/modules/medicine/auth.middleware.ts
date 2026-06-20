import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN";
  };
}

export const verifyTokenAndRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        role: "CUSTOMER" | "SELLER" | "ADMIN";
      };

      req.user = decoded;

      if (!allowedRoles.includes(decoded.role)) {
        res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
        return;
      }

      next();
    } catch (error) {
      res
        .status(403)
        .json({ message: "Access denied. Invalid token or expired token." });
    }
  };
};
