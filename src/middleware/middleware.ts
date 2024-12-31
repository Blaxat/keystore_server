import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.token as string;

  if (!token) {
    res.status(400).json({ message: "Token not found" });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables");
    throw new Error("Server configuration error");
  }

  try {
    const verified = jwt.verify(token, secret) as { payload?: string };

    if (!verified || !verified.payload) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    req.phrase = verified.payload; 
    next();
  } catch (error) {
    console.error("Token verification error:", (error as Error).message);
    res.status(500).json({ message: "Invalid or expired token" });
    return;
  }
};
