import { Router } from "express";
import { getAllUsers, toggleUserBan } from "./admin.controller.js";
import { verifyTokenAndRole } from "../medicine/auth.middleware.js";

const router = Router();

router.get("/users", verifyTokenAndRole(["ADMIN"]), getAllUsers);

router.patch(
  "/users/:userId/ban",
  verifyTokenAndRole(["ADMIN"]),
  toggleUserBan,
);

export const AdminRoutes = router;
