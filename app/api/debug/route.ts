import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    try {
        const services = await prisma.service.findMany();
        return NextResponse.json({
            count: services.length,
            services: services,
            env: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING'
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
