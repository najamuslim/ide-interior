import { NextResponse } from "next/server";
import redis from "../../utils/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      // 30 requests per minute per IP
      // Lebih longgar dari create invoice karena ini endpoint yang dipoll
      limiter: Ratelimit.fixedWindow(30, "60 s"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  try {
    const { originalPhoto, theme, room } = await request.json();
    
    if (!originalPhoto || !theme || !room) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    //Rate Limiter Code
    if (ratelimit) {
      const headersList = headers();
      const ipIdentifier = headersList.get("x-real-ip");

      const result = await ratelimit.limit(ipIdentifier ?? "");

      if (!result.success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const external_id = `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const base64Credentials = Buffer.from(`${process.env.XENDIT_API_KEY}:`).toString('base64');
    
    const paymentResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify({
        external_id,
        amount: 10000,
        payment_methods: ["QRIS", "BCA"],
        currency: "IDR",
        description: `Design for ${room} - ${theme} theme`,
        success_redirect_url: `${process.env.NEXT_PUBLIC_URL}/dream?theme=${theme}&room=${room}&invoice=${external_id}&status=success`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_URL}/dream?theme=${theme}&room=${room}&invoice=${external_id}&status=failed`,
        expiry_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        metadata: {
          originalPhoto,
          theme,
          room
        }
      }),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.error('Xendit API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to create invoice: ${errorData.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const paymentJson = await paymentResponse.json();
    return NextResponse.json({ 
      invoiceUrl: paymentJson.invoice_url,
      invoiceId: external_id
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
