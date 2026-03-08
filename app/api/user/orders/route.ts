import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        let orders = await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        // Sync pending cashfree orders
        const pendingOrders = orders.filter(o => o.status === "pending" && o.paymentMethod === "paytm");
        if (pendingOrders.length > 0) {
            const appId = process.env.CASHFREE_APP_ID;
            const secretKey = process.env.CASHFREE_SECRET_KEY;
            const env = process.env.CASHFREE_ENV || 'SANDBOX';
            const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

            if (appId && secretKey) {
                for (const order of pendingOrders.slice(0, 5)) {
                    try {
                        const response = await fetch(`${baseUrl}/orders/${order.id}`, {
                            headers: {
                                'Accept': 'application/json',
                                'x-api-version': '2023-08-01',
                                'x-client-id': appId,
                                'x-client-secret': secretKey
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.order_status === "PAID") {
                                await prisma.order.update({
                                    where: { id: order.id },
                                    data: { status: "processing" }
                                });
                                order.status = "processing";
                            } else if (data.order_status === "ACTIVE") {
                                // Still pending
                            } else if (data.order_status === "DROPPED" || data.order_status === "FAILED") {
                                await prisma.order.update({
                                    where: { id: order.id },
                                    data: { status: "failed" }
                                });
                                order.status = "failed";
                            }
                        }
                    } catch (e) {
                        console.error("Failed to sync order", order.id, e);
                    }
                }
            }
        }

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("GET orders error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
