import { NextResponse } from 'next/server';

const ICARRY_BASE = 'https://www.icarry.in';
const ICARRY_EMAIL = process.env.ICARRY_EMAIL || '';
const ICARRY_PASSWORD = process.env.ICARRY_PASSWORD || '';
const ICARRY_API_USERNAME = process.env.ICARRY_USERNAME || '';
const ICARRY_API_KEY = process.env.ICARRY_API_KEY || '';
const ICARRY_ORIGIN_PINCODE = process.env.ICARRY_ORIGIN_PINCODE || '462038';

// Cache the session cookie for 30 min to avoid logging in every request
let sessionCookie: string | null = null;
let sessionExpiry = 0;

async function getSessionCookie(): Promise<string | null> {
    if (sessionCookie && Date.now() < sessionExpiry) return sessionCookie;

    if (!ICARRY_EMAIL || !ICARRY_PASSWORD) {
        console.log("iCarry: No email/password configured, skipping session auth");
        return null;
    }

    try {
        const body = new URLSearchParams({ email: ICARRY_EMAIL, password: ICARRY_PASSWORD });
        const res = await fetch(`${ICARRY_BASE}/index.php?route=account/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            redirect: 'manual',
            body: body.toString()
        });

        const cookies = res.headers.getSetCookie?.() || [];
        const cookie = cookies.join('; ');
        if (cookie) {
            sessionCookie = cookie;
            sessionExpiry = Date.now() + 25 * 60 * 1000; // 25 min
            console.log("iCarry: Session obtained successfully");
            return sessionCookie;
        }
        console.error("iCarry: Login did not return cookies");
        return null;
    } catch (e: any) {
        console.error("iCarry: Login error:", e.message);
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const { pincode, items } = await req.json();
        if (!pincode || String(pincode).length !== 6) {
            return NextResponse.json({ success: false, error: 'Valid 6-digit pincode required' }, { status: 400 });
        }

        // 1. Calculate dimensions from cart
        let totalWeight = 500;
        let maxL = 10, maxB = 10, totalH = 10;
        let totalValue = 500;

        try {
            const cartItems: any[] = Array.isArray(items) ? items : JSON.parse(items);
            totalWeight = 0; totalValue = 0; totalH = 0;
            for (const item of cartItems) {
                const p = item.product || item;
                const qty = item.qty || 1;

                let pWeight = Number(p.weight) || 500;
                let pLength = Number(p.length) || 10;
                let pBreadth = Number(p.breadth) || 10;
                let pHeight = Number(p.height) || 10;

                let usedBulk = false;
                if (p.bulkPricing) {
                    try {
                        let bulkTiers = Array.isArray(p.bulkPricing) ? p.bulkPricing : JSON.parse(p.bulkPricing);
                        const applicable = bulkTiers.filter((t: any) => qty >= t.qty).sort((a: any, b: any) => b.qty - a.qty);
                        if (applicable.length > 0 && applicable[0].weight) { // Check if tier has dimensions
                            const tier = applicable[0];
                            totalWeight += Number(tier.weight);
                            maxL = Math.max(maxL, Number(tier.length) || pLength);
                            maxB = Math.max(maxB, Number(tier.breadth) || pBreadth);
                            totalH += Number(tier.height) || pHeight;
                            usedBulk = true;
                        }
                    } catch { /* ignore parse errors */ }
                }

                if (!usedBulk) {
                    totalWeight += pWeight * qty;
                    maxL = Math.max(maxL, pLength);
                    maxB = Math.max(maxB, pBreadth);
                    totalH += pHeight * qty;
                }

                totalValue += (Number(p.price) || 0) * qty;
            }
            totalWeight = Math.max(totalWeight, 100);
            totalH = Math.max(totalH, 1);
        } catch { /* use defaults */ }

        // 2. Try direct API call using api_username as token (some iCarry accounts use this)
        const directPayload = {
            api_token: ICARRY_API_USERNAME,
            origin_pincode: parseInt(ICARRY_ORIGIN_PINCODE),
            destination_pincode: parseInt(pincode),
            origin_country_code: 'IN',
            destination_country_code: 'IN',
            shipment_mode: 'S',
            shipment_type: 'P',
            shipment_value: Math.ceil(totalValue),
            weight: Math.ceil(totalWeight),
            length: Math.ceil(maxL),
            breadth: Math.ceil(maxB),
            height: Math.ceil(totalH)
        };

        const directRes = await fetch(`${ICARRY_BASE}/api_get_estimate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(directPayload)
        });
        const directText = await directRes.text();
        console.log("iCarry direct attempt:", directText.slice(0, 300));

        try {
            const directData = JSON.parse(directText);
            if (directData.success === 1 && directData.estimate?.length > 0) {
                const cheapest = directData.estimate.reduce((p: any, c: any) =>
                    parseFloat(c.courier_cost) < parseFloat(p.courier_cost) ? c : p);
                return NextResponse.json({
                    success: true,
                    shippingCost: Math.ceil(parseFloat(cheapest.courier_cost)),
                    courier: cheapest.courier_name
                });
            }
        } catch { /* try next method */ }

        // 3. Try session-based call to the internal rate calculator
        const cookie = await getSessionCookie();
        if (cookie) {
            const params = new URLSearchParams({
                country_id: '99',
                weight: String(Math.ceil(totalWeight)),
                weight_unit: 'gm',
                length: String(Math.ceil(maxL)),
                length_unit: 'cm',
                breadth: String(Math.ceil(maxB)),
                breadth_unit: 'cm',
                height: String(Math.ceil(totalH)),
                height_unit: 'cm',
                vol_wt: String((maxL * maxB * totalH / 5000).toFixed(3)) + ' Kg',
                mode: 'S',
                parcel_type: 'P',
                parcel_value: String(Math.ceil(totalValue)),
                sender_pincode: ICARRY_ORIGIN_PINCODE,
                receiver_pincode: pincode
            });

            const sessionRes = await fetch(`${ICARRY_BASE}/index.php?route=account/ela_estimate_inner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie
                },
                body: params.toString()
            });
            const sessionText = await sessionRes.text();
            console.log("iCarry session-based response:", sessionText.slice(0, 500));

            try {
                const sessionData = JSON.parse(sessionText);
                if (sessionData && !sessionData.error && Array.isArray(sessionData) && sessionData.length > 0) {
                    const cheapest = sessionData.reduce((p: any, c: any) =>
                        parseFloat(c.total_rate || c.rate || c.courier_cost || 999) < parseFloat(p.total_rate || p.rate || p.courier_cost || 999) ? c : p);
                    const cost = parseFloat(cheapest.total_rate || cheapest.rate || cheapest.courier_cost || 0);
                    return NextResponse.json({
                        success: true,
                        shippingCost: Math.ceil(cost),
                        courier: cheapest.courier_name || cheapest.service_name || 'iCarry'
                    });
                }
            } catch { /* use fallback */ }
        }

        // 4. Fallback: zone-based pricing
        const pincodeNum = parseInt(pincode);
        let fallbackCost = 150;
        if (pincodeNum >= 400000 && pincodeNum <= 431000) fallbackCost = 60;  // Maharashtra
        else if (pincodeNum >= 110000 && pincodeNum <= 110099) fallbackCost = 100; // Delhi
        else if (pincodeNum >= 380000 && pincodeNum <= 396999) fallbackCost = 80;  // Gujarat

        return NextResponse.json({
            success: true,
            shippingCost: fallbackCost,
            courier: 'Standard Rate',
            fallback: true
        });

    } catch (error: any) {
        console.error("Shipping API error:", error?.message);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}
