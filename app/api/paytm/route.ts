import { NextResponse } from "next/server";
import PaytmChecksum from "paytmchecksum"; // 🔥 IMPORTANT IMPORT

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount missing" },
        { status: 400 }
      );
    }

    const mid = process.env.PAYTM_MID;
    const mkey = process.env.PAYTM_MKEY;
    const website = process.env.PAYTM_WEBSITE;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!mid || !mkey || !website || !baseUrl) {
      return NextResponse.json(
        { error: "Environment variables missing" },
        { status: 500 }
      );
    }

    const orderId = "ORDER_" + Date.now();

    const paytmParams: any = {
      MID: mid,
      WEBSITE: website,
      INDUSTRY_TYPE_ID: "Retail",
      CHANNEL_ID: "WEB",
      ORDER_ID: orderId,
      CUST_ID: "CUST_" + Date.now(),
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${baseUrl}/api/paytm/callback`,
    };

    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      mkey
    );

    return NextResponse.json({
      paytmParams,
      checksum,
    });

  } catch (error) {
    console.error("Paytm Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}