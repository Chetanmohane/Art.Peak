import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

async function isAuthorized(session: any) {
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === "admin" || user?.role === "editor";
}

// GET /api/admin/services — fetch ALL services
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(await isAuthorized(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const services = await prisma.service.findMany({
            orderBy: { createdAt: "asc" },
        });

        const parsedServices = services.map((s: any) => {
            let features = [];
            try {
                features = typeof s.features === 'string' ? JSON.parse(s.features || "[]") : (Array.isArray(s.features) ? s.features : []);
            } catch (e) {
                console.error("Error parsing features:", e);
                features = [];
            }
            return {
                ...s,
                features
            };
        });

        return NextResponse.json(parsedServices);
    } catch (error) {
        console.error("Admin services GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// POST /api/admin/services — create a new service
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(await isAuthorized(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { title, desc, longDesc, image, tag, iconName, features } = body;

        const service = await prisma.service.create({
            data: {
                title,
                desc,
                longDesc,
                image,
                tag,
                iconName,
                features: JSON.stringify(features || []),
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error("Admin services POST error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PUT /api/admin/services — update an existing service
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(await isAuthorized(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { id, title, desc, longDesc, image, tag, iconName, features } = body;

        const service = await prisma.service.update({
            where: { id },
            data: {
                title,
                desc,
                longDesc,
                image,
                tag,
                iconName,
                features: JSON.stringify(features || []),
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error("Admin services PUT error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE /api/admin/services?id=xxx — delete a service
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(await isAuthorized(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing id", { status: 400 });
        }

        await prisma.service.delete({ where: { id } });
        return new NextResponse("Service Deleted", { status: 200 });
    } catch (error) {
        console.error("Admin services DELETE error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
