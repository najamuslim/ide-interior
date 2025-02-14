import { NextResponse } from "next/server";
import redis from "../../utils/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { EmailAddress } from "@clerk/nextjs/server";

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
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Try to get authenticated user, but don't require it
    const user = await currentUser();

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

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const base64Credentials = Buffer.from(
      `${process.env.MIDTRANS_SERVER_KEY}:`
    ).toString("base64");

    // Get user details if authenticated, otherwise use guest info
    const customerDetails = user
      ? {
          first_name: user.firstName || "Guest",
          last_name: user.lastName || "User",
          email:
            user.emailAddresses.find(
              (email: EmailAddress) => email.id === user.primaryEmailAddressId
            )?.emailAddress || "guest@example.com",
        }
      : {
          first_name: "Guest",
          last_name: "User",
          email: "guest@example.com",
        };

    console.log(
      `${process.env.NEXT_PUBLIC_URL}/dream?theme=${theme}&room=${room}&order_id=${orderId}&status=success`
    );

    const paymentResponse = await fetch(
      "https://api.midtrans.com/v1/payment-links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: orderId,
            gross_amount: 25000,
          },
          enabled_payments: ["gopay", "shopeepay", "bca_va"],
          customer_details: customerDetails,
          expiry: {
            duration: 30,
            unit: "minutes",
          },
          item_details: [
            {
              name: `Design for ${room} - ${theme} theme`,
              quantity: 1,
              price: 25000,
            },
          ],
          metadata: {
            originalPhoto,
            theme,
            room,
            userId: user?.id || "guest",
          },
          callbacks: {
            finish: `${
              process.env.NEXT_PUBLIC_URL
            }/dream?theme=${encodeURIComponent(
              theme
            )}&room=${encodeURIComponent(
              room
            )}&order_id=${orderId}&status=success`,
            cancel: `${
              process.env.NEXT_PUBLIC_URL
            }/dream?theme=${encodeURIComponent(
              theme
            )}&room=${encodeURIComponent(
              room
            )}&order_id=${orderId}&status=cancel`,
            error: `${
              process.env.NEXT_PUBLIC_URL
            }/dream?theme=${encodeURIComponent(
              theme
            )}&room=${encodeURIComponent(
              room
            )}&order_id=${orderId}&status=error`,
            unfinish: `${
              process.env.NEXT_PUBLIC_URL
            }/dream?theme=${encodeURIComponent(
              theme
            )}&room=${encodeURIComponent(
              room
            )}&order_id=${orderId}&status=unfinish`,
          },
        }),
      }
    );

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.error("Midtrans API Error:", errorData);
      return NextResponse.json(
        {
          error: `Failed to create payment link: ${
            errorData.error_messages?.[0] || "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }

    const paymentJson = await paymentResponse.json();
    return NextResponse.json({
      invoiceUrl: paymentJson.payment_url,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Payment link creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
