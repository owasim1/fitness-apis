import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/users", createUser);
router.get("/users/:id", authenticate, getUsers);
router.put("/users/:id", authenticate, updateUser);

export default router;
