import type { Request, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import { prisma } from "../../lib/prisma.js";

export const createCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "category name is required." });
      return;
    }

    const category = await prisma.category.create({ data: { name } });
    res
      .status(201)
      .json({ message: "Category created successfully.", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category." });
  }
};

export const addMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, price, stock, manufacturer, categoryId } =
      req.body;
    const sellerId = req.user?.id;

    if (!name || !price || !stock || !categoryId || !sellerId) {
      res.status(400).json({ message: "Required fields are missing." });
      return;
    }

    const newMedicine = await prisma.medicine.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        manufacturer,
        categoryId,
        sellerId,
      },
    });

    res
      .status(201)
      .json({ message: "Medicine added successfully.", medicine: newMedicine });
  } catch (error) {
    res.status(500).json({ message: "Failed to add medicine." });
  }
};

export const getAllMedicines = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { search, categoryId } = req.query;
    const sellerId = req.user?.id;

    const whereClause: any = {};

    if (sellerId) {
      whereClause.sellerId = sellerId;
    }
    if (categoryId) {
      whereClause.categoryId = categoryId as string;
    }
    if (search) {
      whereClause.name = { contains: search as string, mode: "insensitive" };
    }

    const medicines = await prisma.medicine.findMany({
      where: whereClause,
      include: { category: true },
    });

    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve medicines." });
  }
};

export const getSingleMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({
      where: { id: id as string },
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch this medicine details" });
  }
};

export const getAllCategories = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Sorry, Failed to retrieve categories." });
  }
};

export const updateMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, categoryId, price, manufacturer, stock } = req.body;
    const sellerId = req.user?.id;

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: id as string },
    });
    if (!existingMedicine || existingMedicine.sellerId !== sellerId) {
      res.status(403).json({
        message: "Sorry, you are not authorized to update this medicine.",
      });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (categoryId) updateData.categoryId = categoryId;
    if (manufacturer) updateData.manufacturer = manufacturer;
    if (price !== undefined && price !== null) updateData.price = Number(price);
    if (stock !== undefined && stock !== null) updateData.stock = Number(stock);

    const updatedMedicine = await prisma.medicine.update({
      where: { id: id as string },
      data: updateData,
    });

    res.status(200).json({
      message: "Medicine updated successfully!",
      medicine: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine." });
  }
};

export const deleteMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id;

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: id as string },
    });
    if (!existingMedicine || existingMedicine.sellerId !== sellerId) {
      res.status(403).json({
        message: "Sorry, you are not authorized to delete this medicine.",
      });
      return;
    }

    await prisma.medicine.delete({ where: { id: id as string } });
    res
      .status(200)
      .json({ message: "Medicine removed from inventory successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine." });
  }
};
