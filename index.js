import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import usersroute from "./router/users.js";
import uploadRouter from "./router/upload.js";
import taskRouter from "./router/task.js";
import authrouter from "./router/auth.js";
import adminroutes from "./router/admin.js";

import logger from "./middleware/logger.js";
import notfound from "./middleware/notfound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { limiter } from "./middleware/rateLimiter.js";
import { swaggerSpec } from "./utilities/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Basic Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(logger);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiter middleware
app.use(limiter);

let users = [
  { id: 1, name: "Ayaan" },
  { id: 2, name: "Fatima" },
  { id: 3, name: "Zubeyr" },
];

// Base Route
app.get("/", (req, res) => {
  res.json(users);
});

// API Routes
app.use("/users", usersroute);
app.use("/auth", authrouter);
app.use("/admin", adminroutes);
app.use("/upload", uploadRouter);
app.use("/tasks", taskRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handling Middlewares (Must be at the bottom)
app.use(notfound);
app.use(errorHandler);

// Database Connection & Server Start
const startServer = async () => {
  // Hubi Environment Variable-ka MongoDB
  const mongoUri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PRO || process.env.MONGO_URI
      : process.env.MONGO_URI_DEV || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB Connection URI is not configured in Environment Variables.",
    );
  }

  await mongoose.connect(mongoUri);
  console.log("Database connected successfully");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
