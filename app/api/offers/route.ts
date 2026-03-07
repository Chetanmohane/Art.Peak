import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

async function isAuthorized(session: any) {
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === "admin" || user?.role === "editor";
}

export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(offers);
    } catch (err: any) {
        console.error("GET OFFERS ERROR", err);
        return NextResponse.json({
            error: "Failed to fetch offers",
            details: err.message,
            code: err.code
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(await isAuthorized(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        const body = await req.json();
        const offer = await prisma.offer.create({
            data: {
                festival: body.festival || "",
                title: body.title || "",
                subtitle: body.subtitle || "",
                discountPercent: parseFloat(body.discountPercent || "0"),
                code: body.code || "",
                validTill: body.validTill || "",
                emoji: body.emoji || "",
                glow: body.glow || "",
                darkBg: body.darkBg || "",
                lightBg: body.lightBg || "",
                darkTextAccent: body.darkTextAccent || "",
                lightTextAccent: body.lightTextAccent || "",
                isActive: body.isActive !== undefined ? body.isActive : true,
                minQuantity: parseInt(body.minQuantity || "0"),
                minAmount: parseFloat(body.minAmount || "0"),
            },
        });
        return NextResponse.json(offer);
    } catch (err: any) {
        console.error("CREATE OFFER ERROR", err);
        return NextResponse.json({
            error: "Failed to create offer",
            details: err.message,
            code: err.code
        }, { status: 500 });
    }
}
