import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";

// Helper: verify caller is admin by checking DB
async function isAdmin(session: any) {
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === "admin";
}

// GET /api/admin/users — fetch ALL users (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden — Admins only", { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Admin users GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE /api/admin/users?id=xxx — delete a user (admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing id", { status: 400 });
        }

        // Optional: Prevent admin from deleting themselves
        const userToDelete = await prisma.user.findUnique({ where: { id } });
        if (userToDelete?.email === session.user.email) {
            return new NextResponse("You cannot delete yourself", { status: 400 });
        }

        await prisma.user.delete({ where: { id } });
        return new NextResponse("User Deleted", { status: 200 });
    } catch (error) {
        console.error("Admin users DELETE error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
