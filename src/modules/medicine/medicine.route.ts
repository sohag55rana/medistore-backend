import { Router } from "express";
import {
  addMedicine,
  getAllMedicines,
  createCategory,
  getAllCategories,
  deleteMedicine,
  updateMedicine,
  getSingleMedicine,
} from "./medicine.controller.js";
import { verifyTokenAndRole } from "./auth.middleware.js";

const router = Router();

router.post(
  "/categories",
  verifyTokenAndRole(["ADMIN", "SELLER"]),
  createCategory,
);

router.post("/add", verifyTokenAndRole(["SELLER"]), addMedicine);

router.get("/", getAllMedicines);

router.get("/:id", getSingleMedicine);

router.get("/categories", getAllCategories);

router.put("/:id", verifyTokenAndRole(["SELLER"]), updateMedicine);

router.delete("/:id", verifyTokenAndRole(["SELLER"]), deleteMedicine);
export const MedicineRoutes = router;
