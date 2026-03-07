import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
    const services = await prisma.service.findMany()
    console.log('--- DATABASE SERVICES ---')
    console.log(JSON.stringify(services, null, 2))
    console.log('--- TOTAL: ' + services.length + ' ---')
}

main().catch(console.error).finally(() => prisma.$disconnect())
