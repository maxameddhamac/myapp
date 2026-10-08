import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const protect = async (req, res, next) => {
  const [scheme, token] =
    req.headers.authorization?.trim().split(/\s+/, 2) ?? [];
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const secret = process.env.jwtSecret || process.env.JWT_SECRET || "change-me";
  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (typeof decoded !== "object" || typeof decoded.id !== "string") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
