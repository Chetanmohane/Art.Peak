import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// POST /api/contact — save a new contact message
export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        const contact = await prisma.contactMessage.create({
            data: { name, email, message },
        });

        return NextResponse.json(contact, { status: 201 });
    } catch (error: any) {
        console.error("Contact POST error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// GET /api/contact — fetch all contact messages (for admin/profile view)
export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Contact GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
