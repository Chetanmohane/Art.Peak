import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

async function isAdmin(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
    });
    return user?.role === "admin";
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || !(await isAdmin(session.user.email))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let orders: any = await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const pendingOrders = orders.filter((o: any) => o.status === "pending" && o.paymentMethod === "paytm");
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
                        console.error("Failed to sync admin order", order.id, e);
                    }
                }
            }
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Admin Orders GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || !(await isAdmin(session.user.email))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status } = await req.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Admin Order PUT error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || !(await isAdmin(session.user.email))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Order ID is required", { status: 400 });
        }

        await prisma.order.delete({
            where: { id },
        });

        return new NextResponse("Order deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Admin Order DELETE error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
