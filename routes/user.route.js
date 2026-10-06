import express from "express";
import { registerUser, getUsers,loginUser, updateUser, deleteUser  } from '../controllers/auth.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/user-signUp", registerUser);
router.get("/users", getUsers);
router.post("/user-login", loginUser);
router.put("/update/:user_id", updateUser);
router.delete("/delete/:user_id", deleteUser)



export default router;