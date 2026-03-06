import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";

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

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

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
