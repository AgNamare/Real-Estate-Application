import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import authRouter from "./routes/auth.route.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGOURL).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.log("Error: ", err);
});

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

const corsOptions = {
  origin: ['http://localhost:5173', 'https://edge-estate.onrender.com'],
  credentials: true
};

app.use(cors(corsOptions));

app.listen(5000, function () {
  console.log('Server is running on port 5000!');
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
