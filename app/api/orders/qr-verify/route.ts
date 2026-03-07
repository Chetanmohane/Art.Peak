import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { items, totalAmount, transactionId, shipping } = await req.json();

        if (!items || !totalAmount || !transactionId || !shipping) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        if (!/^\d{12}$/.test(transactionId)) {
            return new NextResponse("Invalid UTR ID format. It must be a 12-digit number.", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const existingOrder = await prisma.order.findFirst({
            where: { transactionId }
        });

        if (existingOrder) {
            return new NextResponse("This UTR ID has already been used. Please use a unique transaction ID.", { status: 400 });
        }

        // Create the order with 'processing' status since it's auto-verified
        const orderData: any = {
            userId: user.id,
            items, // Already a JSON string
            totalAmount: parseFloat(totalAmount),
            paymentMethod: "qr",
            transactionId,
            status: "processing", // Auto-approved
            customerName: shipping.name,
            phone: shipping.phone,
            email: shipping.email || null,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            pincode: shipping.pincode
        };

        const order = await prisma.order.create({
            data: orderData,
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
        console.error("QR Order creation error:", error);
        return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
    }
}
