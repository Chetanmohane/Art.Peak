import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Parse JSON strings back to objects safely
        const parsedProducts = products.map((p: any) => {
            let images = [];
            let bulkPricing = [];
            let sizes = [];

            try { images = JSON.parse(p.images || "[]"); } catch (e) { images = [p.image || "/placeholder.png"]; }
            try { bulkPricing = p.bulkPricing ? JSON.parse(p.bulkPricing) : []; } catch (e) { bulkPricing = []; }
            try { sizes = p.sizes ? JSON.parse(p.sizes) : []; } catch (e) { sizes = []; }

            return {
                ...p,
                images,
                bulkPricing,
                sizes,
                minQuantity: p.minQuantity ?? 1
            };
        });

        return NextResponse.json(parsedProducts);
    } catch (error) {
        console.error("Public products GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
