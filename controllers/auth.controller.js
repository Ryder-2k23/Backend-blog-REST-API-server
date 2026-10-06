import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import{ sendSuccess, sendError } from "../utils/response.js";

import User from "../models/user.model.js"


env.config();

//token generated
const generateToken = (user)=>{
    return jwt.sign(
        {
            id:user._id
        },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
    );
};


// register user 
export const registerUser = async(req, res)=>{
    try {
        const { first_name, last_name, email, contact, password } = req.body;

        if(!first_name || !last_name || !email || !password){
            return sendError(
                res,
                400,
                "Your first name, last name, email and password are required"
            )
        };

        
            // preventing malisciouse emails
        const normalizeEmail = email.toLowerCase();


            //Checking user existence
        const existingUser = await User.findOne({email: normalizeEmail});

        if(existingUser){
            return sendError(res, 409, "This User already exists")
        }


            //hashing password
        const hashPassword = await bcrypt.hash(password, 10);

            // user profile
        const user = await User.create({
            first_name,
            last_name,
            email:normalizeEmail,
            contact,
            password: hashPassword
        });
        return sendSuccess(res, 201, "User created successfully!", user);

        const token = generateToken(user);
        return sendSuccess(res, 201,"User registration successful!",{accessToken: token});

    } catch (error) {
        console.error("Error creating User: ", error);
        
        return sendError(res, 500, "Failed to create User", error.message)
    }
}


//get all users
export const getUsers = async(req, res)=>{
    try {
        const users = await User.find().sort({createdAt: -1});
        return sendSuccess(res, 200, "User retrieved successfully!", users);
    } catch (error) {
        console.error("Error getting Users: ", error);     
        return sendError(res, 500, "Failed to get Users", error.message)
    }
}


//login
export const loginUser = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return sendError(res, 400, "Invalid Email or parssword")
        };
        const normalizeEmail = email.toLowerCase();

            //including password so my hidden password from schema becomes found
        const user = await User.findOne({email:normalizeEmail}).select("+password");

        console.log("Email recieved: ", email);
        console.log("Normalized email: ", normalizeEmail );
        console.log("User found: ", user);

        if(!user){
            return sendError(res, 401, "User is not found");
        };

            //unhashing password
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        console.log("password corrected: ", passwordIsCorrect);

        if(!passwordIsCorrect){
            return sendError(res, 401, "Invalid email or password");
        }

        const token = generateToken(user);
        return sendSuccess(res, 200, "Login successful!", {
            user:{
                id:user._id,
                email:user.email
            },
            accessToken: token
        })
        
    } catch (error) {
        console.error("Error logging in User: ", error);     
        return sendError(res, 500, "Failed to login User", error.message)
    }
}


//update user
export const updateUser = async(req, res)=>{
    try {
        const { user_id } = req.params;
        
        const user = await User.findByIdAndUpdate(user_id, req.body, {new:true, runValidators:true});

        if(!user){
            return sendError(res, 404, "User not found")
        }
        return sendSuccess(res, 200, "User updated successfully!", user )
    }  catch (error) {
        console.error("Error updating User: ", error);     
        return sendError(res, 500, "Failed to update User", error.message)
    }
}


//delete user
export const deleteUser = async(req, res)=>{
    try {
        const { user_id } = req.params;
        const user = await User.findByIdAndDelete(user_id);

        if(!user){
             return sendError(res, 404, "User does not exist")
        }
        return sendSuccess(res, 200, "User deleted successfully!")
    }  catch (error) {
        console.error("Error deleting User: ", error);     
        return sendError(res, 500, "Failed to delete User", error.message)
    }
}


//TODO: get single user
