import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return new NextResponse("Missing Info", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.password) {
            return new NextResponse("User not found", { status: 404 });
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isCorrectPassword) {
            return new NextResponse("Invalid current password", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Change password error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
