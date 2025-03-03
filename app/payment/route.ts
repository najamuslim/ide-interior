import { NextResponse } from "next/server";
import redis from "../../utils/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { EmailAddress } from "@clerk/nextjs/server";
import { supabase } from "../../utils/supabaseClient";

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(30, "60 s"),
      analytics: true,
    })
  : undefined;

const CREDIT_PACKAGES = {
  starter: {
    credits: 5,
    price: 25000,
  },
  pro: {
    credits: 10,
    price: 45000,
  },
  premium: {
    credits: 25,
    price: 100000,
  },
};

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();

    if (!plan || !CREDIT_PACKAGES[plan as keyof typeof CREDIT_PACKAGES]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Try to get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate Limiter Code
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

    const selectedPackage =
      CREDIT_PACKAGES[plan as keyof typeof CREDIT_PACKAGES];
    const orderId = `credits_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const base64Credentials = Buffer.from(
      `${process.env.MIDTRANS_SERVER_KEY}:`
    ).toString("base64");

    // Get user details
    const customerDetails = {
      first_name: user.firstName || "User",
      last_name: user.lastName || "",
      email:
        user.emailAddresses.find(
          (email: EmailAddress) => email.id === user.primaryEmailAddressId
        )?.emailAddress || "",
    };

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
            gross_amount: selectedPackage.price,
          },
          credit_card: {
            secure: true,
          },
          customer_details: customerDetails,
          item_details: [
            {
              id: plan,
              price: selectedPackage.price,
              quantity: 1,
              name: `${selectedPackage.credits} Credits Package - ${
                plan.charAt(0).toUpperCase() + plan.slice(1)
              }`,
            },
          ],
          metadata: {
            credits: selectedPackage.credits,
            userId: user.id,
            plan,
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
