import express from "express";
import { createComment } from '../controllers/comment.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:post_id",authMiddleware,  createComment);



export default router;