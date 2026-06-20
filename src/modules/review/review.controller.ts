import { Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../medicine/auth.middleware.js";

export const createReview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { rating, comment, medicineId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: userId,
        items: {
          some: {
            medicineId: medicineId,
          },
        },
      },
    });

    if (!hasOrdered) {
      res.status(403).json({
        message: "Sorry, you can only review medicines you have ordered.",
      });
      return;
    }

    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId,
        medicineId,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    res
      .status(201)
      .json({ message: "Review added successfully!", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while adding review ok." });
  }
};

export const getMedicineReviews = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { medicineId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { medicineId: medicineId as string },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while fetching reviews." });
  }
};
