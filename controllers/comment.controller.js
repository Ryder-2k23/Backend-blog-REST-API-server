import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { sendSuccess, sendError } from "../utils/response.js";

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

env.config();


export const createComment = async (req, res) => {
    try {
        const { content, replyTo } = req.body;
        const { post_id } = req.params;
        

        if (replyTo) {
            const parentComment = await Comment.findById(replyTo);

            if (!parentComment) {
                return sendError(res, 404, "Comment you are replying to does not exist");
            }

              if (parentComment.post.toString() !== post_id) {
                    return sendError(res, 400, "Comment does not belong to this post");
            } //making sure a reply cannot be used again in another post
        }


        const post = await Post.findById(post_id);


        if (!content || content.trim() === "") {
            return sendError(res, 400, "Content is required")
        }

        if (!post) {
            return sendError(res, 404, "Content is required")
        }
        const comment = await Comment.create({
            content,
            user: req.user._id,
            post: post_id,
            replyTo
        });

        return sendSuccess(res, 201, "Comment added successfully!", comment);

    } catch (error) {
        console.error("Error creating comment: ", error);
        return sendError(res, 500, "Failed to create comment", error.message)
    }
}

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 })
        return sendSuccess(res, 201, "Comment retrieved successfully!", comments);
    } catch (error) {
        console.error("Error creating comment: ", error);
        return sendError(res, 500, "Failed to create comment", error.message)
    }
}


export const updateComment = async (req, res) => {
    try {
        const { comment_id } = req.params;

        const comment = await Comment.findByIdAndUpdate(comment_id, req.body, { new: true, runValidators: true });

        if (!comment) {
            return sendError(res, 404, "Comment does not exist")
        }

        return sendSuccess(res, 201, "Comment updated successfully!", comment);
    } catch (error) {
        console.error("Error updating comment: ", error);
        return sendError(res, 500, "Failed to update comment", error.message)
    }
}


export const deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;

        const comment = await Comment.findByIdAndDelete(comment_id);

        if (!comment) {
            return sendError(res, 404, "Comment does not exist")
        }

        return sendSuccess(res, 201, "Comment deleted successfully!");
    } catch (error) {
        console.error("Error deleting comment: ", error);
        return sendError(res, 500, "Failed to delete comment", error.message)
    }
}

const getNestedReplies = async(comment_id)=>{
    try {
        const replies = await Comment.find({replyTo: comment_id}).sort({createdAt:-1});

        for(const reply of replies){
            reply._doc.replies = await getNestedReplies(reply._id);
        }
        return replies;
    }  catch (error) {
        console.error("Error getting replies: ", error);
        return sendError(res, 500, "Failed to get replies", error.message)
    }
}

export const commentsUnderPost = async (req, res) => {
    try {
        const { post_id } = req.params;

        const comment = await Comment.find({ post: post_id, replyTo:null }).sort({createdAt:1});

        for(const comments of comment){
            comments._doc.replies = await getNestedReplies(comments._id)
        }


        return sendSuccess(res, 200, "Comments retrieved successfully!", comment);
    } catch (error) {
        console.error("Error getting comment: ", error);
        return sendError(res, 500, "Failed to get comments", error.message)
    }
}


export const getReplies = async(req, res)=>{
    try {
        const { comment_id } = req.params;

        const comment = await Comment.findById(comment_id);

        if(!comment){
            return sendError(res, 404, "Comment does not exist")
        }

        const replies = await Comment.find({replyTo: comment_id}).sort({createdAt:1})

        return sendSuccess(res, 200, "Replies retrieved successfully!", replies);
    } catch (error) {
        console.error("Error getting replies: ", error);
        return sendError(res, 500, "Failed to get replies", error.message)
    }
}

