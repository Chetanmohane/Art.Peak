import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { prisma } from "../../../../../lib/prisma";

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  return user?.role === "admin" || user?.role === "editor";
}

// PUT /api/admin/products/order — set top 4 product sequence
// Body: { position1: productId, position2: productId, position3: productId, position4: productId }
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Please log in" }, { status: 401 });
    }
    if (!(await isAdmin(session))) {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const ids = [
      body.position1 || body["1"],
      body.position2 || body["2"],
      body.position3 || body["3"],
      body.position4 || body["4"],
    ].filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: "Select at least one product" }, { status: 400 });
    }

    // Reset all products to 999
    await prisma.product.updateMany({
      data: { sortOrder: 999 },
    });

    // Set sortOrder 1,2,3,4 for selected products
    for (let i = 0; i < ids.length; i++) {
      await prisma.product.update({
        where: { id: ids[i] },
        data: { sortOrder: i + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Products order update error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
