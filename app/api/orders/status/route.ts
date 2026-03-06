import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";

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

        return NextResponse.json({ status: order.status });
    } catch (error: any) {
        console.error("Order polling error:", error);
        return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
    }
}
