import { NextResponse } from "next/server";
import redis from "../../utils/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { EmailAddress } from "@clerk/nextjs/server";

// Helper function to convert spaces to underscores
function formatUrlParam(param: string): string {
  return param.replace(/\s+/g, "_");
}

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

    // Format theme and room for URLs
    const urlTheme = formatUrlParam(theme);
    const urlRoom = formatUrlParam(room);
    const baseCallbackUrl = `${process.env.NEXT_PUBLIC_URL}/dream?theme=${urlTheme}&room=${urlRoom}&order_id=${orderId}`;

    // Create SNAP token
    const snapResponse = await fetch(
      `${process.env.MIDTRANS_HOST_URL}/snap/v1/transactions`,
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
            gross_amount: 9700,
          },
          credit_card: {
            secure: true,
          },
          customer_details: customerDetails,
          item_details: [
            {
              id: "1",
              price: 9700,
              quantity: 1,
              name: `Design for ${room} - ${theme} theme`,
              url: baseCallbackUrl,
            },
          ],
          metadata: {
            originalPhoto,
            theme,
            room,
            userId: user?.id || "guest",
          },
        }),
      }
    );

    const snapData = await snapResponse.json();

    if (!snapResponse.ok) {
      console.error("Midtrans SNAP Error:", snapData);
      return NextResponse.json(
        { error: "Failed to create payment token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token: snapData.token,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
