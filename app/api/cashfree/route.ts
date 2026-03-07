import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const body = await req.json();
        const { amount, customer_id, customer_phone, customer_email, uph_id, items, shipping, paymentMethod } = body;

        if (!amount || parseFloat(amount) <= 0) {
            return NextResponse.json({ success: false, error: 'Positive order amount is required' }, { status: 400 });
        }

        const appId = process.env.CASHFREE_APP_ID;
        const secretKey = process.env.CASHFREE_SECRET_KEY;
        const env = process.env.CASHFREE_ENV || 'SANDBOX';

        if (!appId || !secretKey) {
            return NextResponse.json({ success: false, error: 'Cashfree API keys are missing in the environment' }, { status: 500 });
        }

        const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Save order to Prisma as 'pending'
        const prismaOrderData: any = {
            userId: user.id,
            items: items || "[]",
            totalAmount: parseFloat(amount),
            paymentMethod: paymentMethod === 'qr' ? 'qr' : 'paytm', // Safe fallback because schema expects "paytm" or "qr" by default.
            transactionId: orderId,
            status: "pending",
            customerName: shipping?.name || undefined,
            phone: customer_phone || undefined,
            email: customer_email || undefined,
            address: shipping?.address || undefined,
            city: shipping?.city || undefined,
            state: shipping?.state || undefined,
            pincode: shipping?.pincode || undefined
        };

        const createdOrder = await prisma.order.create({
            data: prismaOrderData,
        });

        // 1. Create Order with Cashfree
        // We use the Prisma generated ID to keep them perfectly synced.
        const orderPayload = {
            order_id: createdOrder.id,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: customer_id || `cust_${Date.now()}`,
                customer_phone: customer_phone || '9999999999',
                customer_email: customer_email || 'test@example.com'
            },
            order_meta: {
                return_url: `https://artpeak.shop/profile?tab=orders&clearCart=true`
            }
        };

        console.log("Attempting to generate Cashfree Order...", orderId);

        const orderResponse = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey
            },
            body: JSON.stringify(orderPayload)
        });

        const cashfreeOrderData = await orderResponse.json();

        if (!orderResponse.ok) {
            console.error("Cashfree Order Error:", cashfreeOrderData);
            return NextResponse.json({ success: false, error: cashfreeOrderData.message || 'Failed to create Cashfree Order', details: cashfreeOrderData }, { status: orderResponse.status });
        }

        // 2. Return Payment Session ID for Frontend SDK Drop-in
        return NextResponse.json({
            success: true,
            orderId: createdOrder.id,
            paymentSessionId: cashfreeOrderData.payment_session_id,
            environment: env
        });

    } catch (error: any) {
        console.error("Cashfree API Exception:", error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
    }
}
