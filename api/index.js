import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGOURL).then(()=>{
  console.log("Connected to MongoDB");
}).catch(err=>{
  console.log("Error: ", err);
});


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors({ origin: "*" }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(5000, function () {
  console.log('Server is running on port 5000!');
 });

 app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode, 
    message
  });
 });