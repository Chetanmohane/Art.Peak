import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

// Helper: verify caller is admin by checking DB
async function isAdmin(session: any) {
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === "admin";
}

// GET /api/admin/contacts — fetch ALL contact messages (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden — Admins only", { status: 403 });
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Admin contacts GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE /api/admin/contacts?id=xxx — delete a message (admin only)
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

        await prisma.contactMessage.delete({ where: { id } });
        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("Admin contacts DELETE error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
