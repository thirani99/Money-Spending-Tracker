import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

console.log("JWT_SECRET =", process.env.JWT_SECRET);


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", req.header("Authorization"));
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "JWT secret not set in environment" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email?: string };
    req.user = { _id: decoded.id, email: decoded.email }; // important: map id to _id

    // const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // (req as AuthRequest).user = decoded;

    // const decoded = jwt.verify(token, secret);
    // req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed", error: err });
  }
};


