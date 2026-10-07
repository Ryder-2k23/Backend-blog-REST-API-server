import express from "express";
import { createComment, getComments, updateComment, deleteComment, commentsUnderPost, getReplies } from '../controllers/comment.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:post_id",authMiddleware,  createComment); // this is the same route for post replies also
router.get("/", getComments); 
router.get("/comments/:post_id", commentsUnderPost);
router.put("/:comment_id", authMiddleware, updateComment)
router.delete("/:comment_id", authMiddleware, deleteComment)
router.get("/:comment_id/replies", getReplies);


export default router;