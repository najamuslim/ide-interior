import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";
import crypto from "crypto";
import { triggerCreditUpdate } from "../../../utils/fetchUserCredits";

// Add middleware config to skip auth for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Add OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  // Skip auth for this endpoint
  try {
    console.log("Webhook received:", request.url);

    // Read the request body once and store it
    const rawBody = await request.text();
    console.log("Raw body:", rawBody);

    const body = JSON.parse(rawBody);
    console.log("Parsed body:", body);

    // Verify the signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signature = body.signature_key;

    const signatureKey =
      body.order_id + body.status_code + body.gross_amount + serverKey;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(signatureKey)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Handle the notification
    const { transaction_status, order_id } = body;

    // Get metadata directly from the metadata field
    const metadata = body.metadata; // Use metadata directly instead of custom_field1

    console.log("Processing transaction:", {
      status: transaction_status,
      orderId: order_id,
      metadata,
    }); // Add logging

    // Only process successful transactions
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      if (!metadata || !metadata.userId || !metadata.credits) {
        console.error("Missing required metadata:", metadata);
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      const { userId, credits } = metadata;

      // Update user credits in the database
      const { data: existingCredits } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .single();

      const newCredits = (existingCredits?.credits || 0) + credits;

      const { error: updateError } = await supabase.from("user_credits").upsert(
        {
          user_id: userId,
          credits: newCredits,
        },
        {
          onConflict: "user_id",
        }
      );

      if (updateError) {
        console.error("Error updating credits:", updateError);
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }

      // Log the transaction
      const { error: logError } = await supabase
        .from("credit_transactions")
        .insert({
          user_id: userId,
          order_id,
          credits_added: credits,
          transaction_status,
        });

      if (logError) {
        console.error("Error logging transaction:", logError);
      }

      // Trigger credit update to refresh the UI
      triggerCreditUpdate(userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
