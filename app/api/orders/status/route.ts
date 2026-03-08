import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const orderId = url.searchParams.get("orderId");

        if (!orderId) {
            return new NextResponse("Missing orderId", { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Only the owner or an admin can check the status
        if (order.user.email !== session.user.email) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user?.role !== "admin") {
                return new NextResponse("Unauthorized", { status: 403 });
            }
        }

        let currentStatus = order.status;

        if (currentStatus === "pending" && order.paymentMethod === "paytm") {
            const appId = process.env.CASHFREE_APP_ID;
            const secretKey = process.env.CASHFREE_SECRET_KEY;
            const env = process.env.CASHFREE_ENV || 'SANDBOX';
            const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

            if (appId && secretKey) {
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
                            currentStatus = "processing";
                        } else if (data.order_status === "DROPPED" || data.order_status === "FAILED") {
                            await prisma.order.update({
                                where: { id: order.id },
                                data: { status: "failed" }
                            });
                            currentStatus = "failed";
                        }
                    }
                } catch (e) {
                    console.error("Failed to sync polling order", order.id, e);
                }
            }
        }

        return NextResponse.json({ status: currentStatus });
    } catch (error: any) {
        console.error("Order polling error:", error);
        return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
    }
}
