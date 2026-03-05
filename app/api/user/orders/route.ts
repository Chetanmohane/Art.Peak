import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";

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

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("GET orders error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
