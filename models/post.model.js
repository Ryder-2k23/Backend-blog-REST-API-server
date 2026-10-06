import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
         set: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
     content:{
        type: String,
        required: true
    },
    image: {
        url: {type: String, default: null},
        public_id: { type: String, default: null}
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    claps:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    author: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema)
export default Post