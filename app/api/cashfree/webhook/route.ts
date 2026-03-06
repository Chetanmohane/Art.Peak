import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-webhook-signature');
        const timestamp = req.headers.get('x-webhook-timestamp');

        const secretKey = process.env.CASHFREE_SECRET_KEY;

        if (!secretKey) {
            console.error("Webhook processing failed: Missing CASHFREE_SECRET_KEY");
            return new NextResponse("Internal Server Error", { status: 500 });
        }

        // Security: Verify Signature
        if (!signature || !timestamp) {
            return new NextResponse("Missing Signature", { status: 400 });
        }

        const payloadToSign = `${timestamp}${rawBody}`;
        const expectedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(payloadToSign)
            .digest('base64');

        if (expectedSignature !== signature) {
            console.error("Webhook signature mismatch.");
            return new NextResponse("Invalid Signature", { status: 401 });
        }

        const event = JSON.parse(rawBody);

        // Only process successful payments
        if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const orderId = event.data.order.order_id;
            const transactionId = event.data.payment.bank_reference || event.data.payment.cf_payment_id.toString();

            console.log(`Webhook received for Order ID: ${orderId}. Marking as processing.`);

            // Find the pending order created during the API call
            const order = await prisma.order.findUnique({
                where: { id: orderId } // Assuming we used Cashfree orderId as Prisma Order ID
            });

            if (order && order.status === "pending") {
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: "processing", // Or "completed"
                        transactionId: transactionId,
                    }
                });
                console.log(`Order ${orderId} updated successfully.`);
            } else {
                console.log(`Order ${orderId} not found or already processed. Status:`, order?.status);
            }
        }

        return new NextResponse("Webhook processed", { status: 200 });
    } catch (error: any) {
        console.error("Webhook exception:", error);
        return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
    }
}
