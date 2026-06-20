// import { PrismaClient } from '@prisma/client';
// import dotenv from "dotenv";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

// dotenv.config();

// export const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

async function server() {
  try {
    await prisma.$disconnect();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

server();
