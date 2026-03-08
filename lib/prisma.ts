import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

console.log(`Prisma: Initialized in ${process.env.NODE_ENV} mode using ${process.env.DATABASE_URL?.split('@')[1] ? 'Remote' : 'Local'} DB`);
