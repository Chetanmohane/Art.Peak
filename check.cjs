const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.order.update({ where: { id: '69ad390ea20329935407f43b' }, data: { status: 'completed' }});
    console.log("Updated to completed");
}
main().catch(console.error).finally(() => prisma.$disconnect());
