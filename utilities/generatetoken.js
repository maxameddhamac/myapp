import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const secret = process.env.jwtSecret || process.env.JWT_SECRET || "change-me";
  return jwt.sign({ id: user._id || user.id }, secret, { expiresIn: "4h" });
};
