import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
  }

  try {
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

    const paymentData = await getPaymentData(orderId);

    if (
      paymentData.last_snap_transaction_status !== "SETTLEMENT" ||
      !paymentData.metadata
    ) {
      return NextResponse.json(paymentData);
    }

    // Return payment data with metadata
    return NextResponse.json({
      status: "PAID",
      metadata: paymentData.metadata,
      loading: true,
    });
  } catch (error) {
    console.error("Error checking payment:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}

async function getPaymentData(orderId: string) {
  const base64Credentials = Buffer.from(
    `${process.env.MIDTRANS_SERVER_KEY}:`
  ).toString("base64");

  const response = await fetch(
    `${process.env.MIDTRANS_HOST_URL}/v1/payment-links/${orderId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch payment data");
  }

  return data;
}
