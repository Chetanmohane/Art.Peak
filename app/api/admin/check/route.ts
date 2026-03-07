import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

// GET /api/admin/check — returns { isAdmin: true/false }
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ isAdmin: false });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        return NextResponse.json({
            isAdmin: user?.role === "admin" || user?.role === "editor",
            role: user?.role
        });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ isAdmin: false, role: "user" });
    }
}
