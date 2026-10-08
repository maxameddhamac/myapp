import express from "express";
import {
  getusers,
  getuserinfo,
  createUser,
  updateUser,
  createManagedUser,
} from "../controllers/users.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getusers);
router.get("/:id", getuserinfo);

// Public Register (Midka lagaga fakarayay dhibaatada 401 Error)
router.post("/register", createUser);

// Single User Create & Update Operations
router.post("/createuser", createUser);
router.put("/updateuser/:id", updateUser);

export default router;
