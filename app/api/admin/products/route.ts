import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

// Helper: verify caller is admin by checking DB
async function isAdmin(session: any) {
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === "admin" || user?.role === "editor";
}

// GET /api/admin/products — fetch ALL products (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden — Admins only", { status: 403 });
        }

        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Parse JSON strings back to objects
        const parsedProducts = products.map((p: any) => ({
            ...p,
            images: JSON.parse(p.images || "[]"),
            bulkPricing: p.bulkPricing ? JSON.parse(p.bulkPricing) : [],
            sizes: p.sizes ? JSON.parse(p.sizes) : [],
            minQuantity: p.minQuantity ?? 1
        }));

        return NextResponse.json(parsedProducts);
    } catch (error) {
        console.error("Admin products GET error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// POST /api/admin/products — create a new product (admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { name, price, image, category, images, bulkPricing, sizes, minQuantity, weight, length, breadth, height } = body;
        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                image,
                category,
                images: JSON.stringify(images || []),
                bulkPricing: JSON.stringify(bulkPricing || []),
                sizes: JSON.stringify(sizes || []),
                minQuantity: parseInt(minQuantity) || 1,
                weight: parseFloat(weight) || 500,
                length: parseFloat(length) || 10,
                breadth: parseFloat(breadth) || 10,
                height: parseFloat(height) || 10,
                sortOrder: 999,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Admin products POST error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PUT /api/admin/products — update an existing product (admin only)
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { id, name, price, image, category, images, bulkPricing, sizes, minQuantity, weight, length, breadth, height, sortOrder } = body;
        const data: Record<string, unknown> = {
            name,
            price: parseFloat(price),
            image,
            category,
            images: JSON.stringify(images || []),
            bulkPricing: JSON.stringify(bulkPricing || []),
            sizes: JSON.stringify(sizes || []),
            minQuantity: parseInt(minQuantity) || 1,
            weight: parseFloat(weight) || 500,
            length: parseFloat(length) || 10,
            breadth: parseFloat(breadth) || 10,
            height: parseFloat(height) || 10,
        };
        if (sortOrder !== undefined) data.sortOrder = sortOrder === "" || sortOrder === null ? 999 : parseInt(String(sortOrder));
        const product = await prisma.product.update({
            where: { id },
            data,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Admin products PUT error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE /api/admin/products?id=xxx — delete a product (admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(await isAdmin(session))) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing id", { status: 400 });
        }

        await prisma.product.delete({ where: { id } });
        return new NextResponse("Product Deleted", { status: 200 });
    } catch (error) {
        console.error("Admin products DELETE error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
