import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

const prisma = new PrismaClient();
const db = prisma as any;

// GET – public: list all active offers (or all for admin)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";
    try {
        const offers = await db.offer.findMany({
            where: all ? {} : { active: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(offers);
    } catch {
        return NextResponse.json([]);
    }
}

// POST – admin only: create offer
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions as any);
    if ((session?.user as any)?.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const offer = await db.offer.create({ data: body });
    return NextResponse.json(offer);
}

// PUT – admin only: update offer
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions as any);
    if ((session?.user as any)?.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { id, ...data } = body;
    const offer = await db.offer.update({ where: { id }, data });
    return NextResponse.json(offer);
}

// DELETE – admin only
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions as any);
    if ((session?.user as any)?.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await req.json();
    await db.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
