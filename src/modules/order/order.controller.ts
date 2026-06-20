import type { Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../medicine/auth.middleware.js";

export const createOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { shippingAddress, items } = req.body;
    const customerId = req.user?.id;

    if (!customerId || !shippingAddress || !items || items.length === 0) {
      res.status(400).json({ message: "please provide all required fields" });
      return;
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    const newOrder = await prisma.order.create({
      data: {
        customerId,
        shippingAddress,
        totalAmount,
        status: "PLACED",
        items: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res
      .status(201)
      .json({ message: "Order created successfully!", order: newOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while creating the order." });
  }
};

// (Get User Orders)
export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { customerId: userId as string },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while fetching user orders." });
  }
};

// (Get Single Order Details)
export const getOrderDetails = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details." });
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching all orders." });
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "please provide a new status" });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId as string },
      data: { status },
    });

    res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while updating the order status." });
  }
};

// (Get Seller Dashboard Statistics)
export const getSellerStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sellerId = req.user?.id;

    const totalMedicines = await prisma.medicine.count({
      where: { sellerId: sellerId as string },
    });

    const lowStockMedicines = await prisma.medicine.count({
      where: {
        sellerId: sellerId as string,
        stock: { lt: 5 }, // Less than 5
      },
    });

    const ordersResult = await prisma.order.aggregate({
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    res.status(200).json({
      totalMedicines: totalMedicines || 0,
      lowStockMedicines: lowStockMedicines || 0,
      totalOrders: ordersResult._count?.id || 0,
      totalEarnings: ordersResult._sum?.totalAmount || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard stats." });
  }
};
