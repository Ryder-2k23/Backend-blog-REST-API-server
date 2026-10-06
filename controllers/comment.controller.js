import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import{ sendSuccess, sendError } from "../utils/response.js";

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

env.config();


export const createComment = async(req, res)=>{
    try {
        const {content} = req.body;
        const { post_id } = req.params;
        const post = await  Post.findById(post_id)

        if(!content || content.trim() === ""){
            return sendError(res, 400, "Content is required")
        }

        if(!post){
            return sendError(res, 404, "Content is required")
        }
        const comment = await Comment.create({
            content,
            user: req.user._id,
            post: post_id
        });

        return sendSuccess(res, 201, "Comment added successfully!", comment);

    } catch (error) {
        console.error("Error creating comment: ", error); 
        return sendError(res, 500, "Failed to create comment", error.message)
    }
}