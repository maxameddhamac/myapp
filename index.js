import express from "express";
const app = express();
import usersroute from "./router/users.js";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import uploadRouter from "./router/upload.js";
import taskRouter from "./router/task.js";
import logger from "./middleware/logger.js";
import helmet from "helmet";
import authrouter from "./router/auth.js";
import adminroutes from "./router/admin.js";
import notfound from "./middleware/notfound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utilities/swagger.js";
import { limiter } from "./middleware/rateLimiter.js";

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(morgan("dev"));

let users = [
  { id: 1, name: "Ayaan" },
  { id: 2, name: "Fatima" },
  { id: 3, name: "Zubeyr" },
];

//router middleware
app.use("/users", usersroute);
app.use("/auth", authrouter);
app.use("/admin", adminroutes);
app.use("/upload", uploadRouter);
app.use("/tasks", taskRouter);
app.use(helmet());
app.get("/", (req, res) => {
  res.json(users);
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// console.log(process.env.PORT);
// 0;

// // GET route
// app.get(`/`, (req, res) => {
//   res.json(users);
// });

// // POST route
// app.post(`/users`, (req, res) => {
//   const userdata = req.body;

//   const newUser = {
//     id: users.length + 1,
//     name: userdata.name,
//   };
//   users.push(newUser);
//   res.status(201).json(newUser);
// });

// //find user by id route
// app.get("/users/:id", (req, res) => {
//   const user = users.find((u) => u.id == req.params.id);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   res.json(user);
// });

// // PUT route
// app.put("/users/:id", (req, res) => {
//   const user = users.find((u) => u.id == req.params.id);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   user.name = req.body.name;

//   res.json(user);
// });

// //delete route
// app.delete("/users/:id", (req, res) => {
//   users = users.filter((u) => u.id != req.params.id);

//   res.send(`User data with id ${req.params.id} deleted successfully`);
// });
app.use(notfound);
app.use(errorHandler);
app.use(limiter);

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(
    process.env.NODE_ENV == "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PRO,
  );
  console.log("database connected");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
