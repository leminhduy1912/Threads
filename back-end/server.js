// import cookieParser from 'cookie-parser';  // Fix typo in import
// import dotenv from 'dotenv';
// import express from 'express';
// import connectDB from './db/connectDB.js';
// import userRoutes from './routes/userRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import messageRoutes from "./routes/messageRoutes.js";
// import cors from 'cors';
// import { v2 as cloudinary } from "cloudinary";
// import { app, server } from "./socket/socket.js";
// dotenv.config();
// connectDB();

// const corsOptions = {
//   origin: 'http://localhost:5173', // Remove the trailing slash to match the exact origin
//   credentials: true,  // Allow credentials like cookies
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow all the necessary HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
// };
// const app = express();
// // Middleware
// app.use(express.json({limit:'60mb'}));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors(corsOptions)); // Use CORS with specified options
// // Route 
// app.use('/api/users', userRoutes);
// app.use('/api/posts',postRoutes)

// // Start server on the correct port
// server.listen(5000, () => console.log('Server started on port 5000'));



import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
// import job from "./cron/cron.js";

dotenv.config();

connectDB();
// job.start();

const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();


const corsOptions = {
  origin: 'http://localhost:5173', // Remove the trailing slash to match the exact origin
  credentials: true,  // Allow credentials like cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow all the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};
// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors(corsOptions));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// http://localhost:5000 => backend,frontend

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	// react app
// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
