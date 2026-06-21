import express, { type Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./modules/user/user.route.js";
import { MedicineRoutes } from "./modules/medicine/medicine.route.js";
import { OrderRoutes } from "./modules/order/order.route.js";
import { AdminRoutes } from "./modules/admin/admin.route.js";
import cookieParser from "cookie-parser";
import { ReviewRoutes } from "./modules/review/review.route.js";

const app: Application = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://medistore-frontend-rose.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use("/api/auth", UserRoutes);
app.use("/api/medicines", MedicineRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/reviews", ReviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("MediStore TypeScript Backend Server is Running! 🚀");
});

export default app;
