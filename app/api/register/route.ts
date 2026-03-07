import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!email || !password || !name) {
            return new NextResponse("Missing Info", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
