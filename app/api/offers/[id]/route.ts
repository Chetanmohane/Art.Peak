import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await req.json();

        // Safely parse numbers to avoid NaN
        const discountPercent = parseFloat(body.discountPercent);
        const minQuantity = parseInt(body.minQuantity);
        const minAmount = parseFloat(body.minAmount);

        const offer = await prisma.offer.update({
            where: { id },
            data: {
                festival: body.festival,
                title: body.title,
                subtitle: body.subtitle,
                discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
                code: body.code,
                validTill: body.validTill,
                emoji: body.emoji,
                glow: body.glow,
                darkBg: body.darkBg,
                lightBg: body.lightBg,
                darkTextAccent: body.darkTextAccent,
                lightTextAccent: body.lightTextAccent,
                isActive: body.isActive,
                minQuantity: isNaN(minQuantity) ? 0 : minQuantity,
                minAmount: isNaN(minAmount) ? 0 : minAmount,
            },
        });

        return NextResponse.json(offer);
    } catch (err: any) {
        console.error("UPDATE OFFER ERROR", err);
        return NextResponse.json({
            error: "Failed to update offer",
            details: err.message,
            stack: err.stack,
            code: err.code
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        await prisma.offer.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Offer deleted successfully" });
    } catch (err) {
        console.error("DELETE OFFER ERROR", err);
        return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
    }
}
