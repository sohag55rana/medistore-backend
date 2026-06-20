import { Router } from "express";
import { createReview, getMedicineReviews } from "./review.controller.js";
import { verifyTokenAndRole } from "../medicine/auth.middleware.js";

const router = Router();

router.post(
  "/",
  verifyTokenAndRole(["CUSTOMER", "SELLER", "ADMIN"]),
  createReview,
);

router.get("/:medicineId", getMedicineReviews);

export const ReviewRoutes = router;
