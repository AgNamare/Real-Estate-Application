import express from "express";
import { google, signIn, signup, signOut } from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/", signup);
router.post("/sign-in", signIn);
router.post("/google", google);
router.get("/signout", signOut)

export default router;