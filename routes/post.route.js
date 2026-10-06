import express from "express";
import { createPost, getSinglePost, getPosts, updatePost, deletePost } from '../controllers/post.conntroller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/posts/", authMiddleware, createPost);
router.get("/posts/:post_id", getSinglePost );
router.get("/posts/", getPosts);
router.put("/posts/:post_id",authMiddleware, updatePost);
router.delete("/posts/:post_id",authMiddleware, deletePost);


export default router;