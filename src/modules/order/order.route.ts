import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderDetails,
  getSellerStats,
  getUserOrders,
  updateOrderStatus,
} from "./order.controller.js";
import { verifyTokenAndRole } from "../medicine/auth.middleware.js";

const router = Router();

router.post("/create", verifyTokenAndRole(["CUSTOMER"]), createOrder);

router.get("/user/:userId", verifyTokenAndRole(["CUSTOMER"]), getUserOrders);

router.get(
  "/seller-stats",
  verifyTokenAndRole(["SELLER", "ADMIN"]),
  getSellerStats,
);

router.get("/", verifyTokenAndRole(["SELLER", "ADMIN"]), getAllOrders);

router.patch(
  "/:orderId/status",
  verifyTokenAndRole(["SELLER", "ADMIN"]),
  updateOrderStatus,
);

router.get(
  "/:id",
  verifyTokenAndRole(["CUSTOMER", "SELLER", "ADMIN"]),
  getOrderDetails,
);

export const OrderRoutes = router;
