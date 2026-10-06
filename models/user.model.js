import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required: [true, "First name is required"],
        trim: true
    },
    last_name:{
        type:String,
        required: [true, "Last name is required"],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    contact:{
        type: String,
        required: [true, "Phone number is required"],
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength:[6, "Password must be at least 6 characters"],
        select:false,
    },
    pronoun:{
        type: String,
        enum: ["He", "She", "Others"],
        default:null
    },
    avatar:{
        type: String,
        default: null
    },
    bio:{
        type:String,
        minlength: [20, "Bio is not detailed enou"],
        default:null
    },
}, {timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;