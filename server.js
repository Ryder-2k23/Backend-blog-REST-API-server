import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware.js";

import authRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js"

dotenv.config()

const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(errorMiddleware)



//routes
app.use("/medium/auth", authRoutes);
app.use("/medium/content", postRoutes);
app.use("/medium/comment", commentRoutes)


connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on PORT ${PORT}`)
);

