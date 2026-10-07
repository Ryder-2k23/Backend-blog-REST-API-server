import express from "express";
import { createPost, getSinglePost, getPosts, updatePost, deletePost, getPostsUnderUser, clapPost } from '../controllers/post.conntroller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/posts/", authMiddleware, createPost);
router.get("/posts/:post_id", getSinglePost );
router.get("/posts/", getPosts);
router.get("/users/:user_id/posts", getPostsUnderUser);
router.put("/posts/:post_id",authMiddleware, updatePost);
router.delete("/posts/:post_id",authMiddleware, deletePost);
router.post("/posts/:post_id/clap", authMiddleware, clapPost);


export default router;