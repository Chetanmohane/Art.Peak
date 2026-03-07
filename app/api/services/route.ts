import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: "asc" },
        });

        const parsedServices = services.map((s: any) => ({
            ...s,
            features: JSON.parse(s.features || "[]"),
        }));

        return NextResponse.json(parsedServices);
    } catch (error) {
        console.error("Public services GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
