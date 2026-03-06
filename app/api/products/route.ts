import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Parse JSON strings back to objects
        const parsedProducts = products.map(p => ({
            ...p,
            images: JSON.parse(p.images || "[]"),
            bulkPricing: p.bulkPricing ? JSON.parse(p.bulkPricing) : []
        }));

        return NextResponse.json(parsedProducts);
    } catch (error) {
        console.error("Public products GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
