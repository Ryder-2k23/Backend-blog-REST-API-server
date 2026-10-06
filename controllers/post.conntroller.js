import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import{ sendSuccess, sendError } from "../utils/response.js";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

env.config();



export const createPost = async(req, res)=>{
    try {
        const { title, content } = req.body;

        if(!title || !content){
            return sendError(res, 404, "Your content is lacking a head or body")
        };


        const post = await Post.create({
            title,
            content,
            author: req.user._id
        });
        
        return sendSuccess(res, 201, "Post created successfully!", post);


    } catch (error) {
        console.error("Error creating Post: ", error);
        
        return sendError(res, 500, "Failed to create post", error.message)
    }
}

export const getSinglePost = async(req, res)=>{
    try {
        const { post_id } = req.params;
        const post =  await Post.findById(post_id);

        if(!post){
            return sendError(res, 404, "Post does not exist");
        }

        return sendSuccess(res, 201, "Post retrieved successfully!", post);

    } catch (error) {
        console.error("Error getting post: ", error);
        
        return sendError(res, 500, "Failed to get post", error.message)
    }
}

export const getPosts = async(req, res)=>{
    try {
        const posts = await Post.find().sort({createdAt: -1})
        return sendSuccess(res, 201, "Post retrieved successfully!", posts);
    }catch (error) {
        console.error("Error getting posts: ", error);
        
        return sendError(res, 500, "Failed to get posts", error.message)
    }
}

export const updatePost = async(req, res)=>{
    try {
        const { post_id } = req.params;
        const posts = await Post.findByIdAndUpdate( post_id, req.body, {new:true, runValidators:true} );
        
        if(!posts){
            return sendError(res, 404, "Post does not exist")
        }

        return sendSuccess(res, 201, "Post retrieved successfully!", posts);

    } catch (error) {
        console.error("Error updating post: ", error);
        
        return sendError(res, 500, "Failed to update post", error.message)
    }
}

export const deletePost = async(req, res)=>{
    try {
        const { post_id } = req.params;
        const user =  await User.findByIdAndDelete( post_id );

        if(!user){
            return sendError(res, 404, "Post does not exist")
        }

         return sendSuccess(res, 201, "Post deleted successfully!"); 
    } catch (error) {
        console.error("Error deleting post: ", error);
        return sendError(res, 500, "Failed to delete post", error.message);
    }
}