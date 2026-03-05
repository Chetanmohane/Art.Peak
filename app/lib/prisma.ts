import { PrismaClient } from '../generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

// Resolve the SQLite file path to an absolute file: URL for the libSQL adapter
const dbPath = path.resolve(process.cwd(), 'dev.db')
const dbUrl = `file:${dbPath}`

const adapter = new PrismaLibSql({
    url: dbUrl,
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
