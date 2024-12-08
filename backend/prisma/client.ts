import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Optional: Enables detailed logging for debugging
});

// Graceful shutdown for Prisma Client
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
