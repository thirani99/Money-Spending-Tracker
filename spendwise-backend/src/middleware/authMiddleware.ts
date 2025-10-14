// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// export const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     (req as any).user = decoded; // attach user info
//     next();
//   } catch {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // attach decoded payload to req
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
