import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount } = await req.json();

  // 🔥 DEBUG: Check if key is loading
  console.log("KEY ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });

  return NextResponse.json(order);
}