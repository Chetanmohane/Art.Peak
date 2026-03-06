import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst();
  if(!user) {
    console.log("No user found");
    return;
  }
  
  try {
    const orderData = {
      id: "order_test_1234",
      userId: user.id,
      items: "[]",
      totalAmount: 1,
      paymentMethod: "qr",
      transactionId: "order_test_1234",
      status: "pending",
      customerName: undefined,
      phone: undefined,
      email: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      pincode: undefined
    };
    
    await prisma.order.create({
      data: orderData
    });
    console.log("Success");
  } catch (e: any) {
    console.error("PRISMA ERROR DETAILS:");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
