import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../medicine/auth.middleware.js";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isBanned: true },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while fetching users." });
  }
};

export const toggleUserBan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId as string },
      data: { isBanned },
    });

    const statusMessage = isBanned
      ? "User has been banned."
      : "User ban has been removed.";
    res.status(200).json({ message: statusMessage, user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error an occurred while updating user status." });
  }
};
