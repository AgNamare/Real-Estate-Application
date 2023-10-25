import express from "express";
import { signIn, signup } from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/", signup);
router.post("/sign-in", signIn);

export default router;