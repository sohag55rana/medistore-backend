import { Router } from "express";
import { registerUser, loginUser } from "./user.controller.js";

const router = Router();

// /api/auth/register
router.post("/register", registerUser);

// /api/auth/login
router.post("/login", loginUser);

export const UserRoutes = router;
