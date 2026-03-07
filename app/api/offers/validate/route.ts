import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const db = prisma as any;

// POST /api/offers/validate  { code, cartTotal }
export async function POST(req: NextRequest) {
    const { code, cartTotal } = await req.json();

    if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

    try {
        const offer = await db.offer.findFirst({
            where: { code: code.toUpperCase().trim(), active: true },
        });

        if (!offer) return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });

        const discountAmount = Math.round((cartTotal * offer.discount) / 100);
        const finalTotal = cartTotal - discountAmount;

        return NextResponse.json({
            valid: true,
            offer: {
                id: offer.id,
                festival: offer.festival,
                title: offer.title,
                discount: offer.discount,
                code: offer.code,
                emoji: offer.emoji,
                glow: offer.glow,
            },
            discountAmount,
            finalTotal,
        });
    } catch {
        return NextResponse.json({ error: "Could not validate code" }, { status: 500 });
    }
}
