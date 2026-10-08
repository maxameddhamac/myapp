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

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  }),
);
app.use(express.json());
app.use(logger);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(limiter);

let users = [
  { id: 1, name: "Ayaan" },
  { id: 2, name: "Fatima" },
  { id: 3, name: "Zubeyr" },
];

app.get("/", (req, res) => {
  res.json(users);
});

app.use("/users", usersroute);
app.use("/auth", authrouter);
app.use("/admin", adminroutes);
app.use("/upload", uploadRouter);
app.use("/tasks", taskRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notfound);
app.use(errorHandler);

const startServer = async () => {
  // Wuxuu isticmaalayaa MONGO_URI, MONGO_URI_PRO, ama MONGO_URI_DEV kii jira
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGO_URI_PRO ||
    process.env.MONGO_URI_DEV;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured in Environment Variables.");
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
