import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";
import crypto from "crypto";
import { triggerCreditUpdate } from "../../../utils/fetchUserCredits";

export async function POST(request: Request) {
  // Always respond with 200 first
  const response = NextResponse.json({ success: true }, { status: 200 });

  try {
    // Read the request body once and store it
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Log the incoming webhook data
    console.log("Webhook received:", body);

    // Process the webhook asynchronously
    processWebhook(body).catch((error) => {
      console.error("Error processing webhook:", error);
    });

    return response;
  } catch (error) {
    console.error("Error parsing webhook:", error);
    return response; // Still return 200 even if parsing fails
  }
}

async function processWebhook(body: any) {
  try {
    // Verify the signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signature = body.signature_key;

    console.log("Verifying signature with:", {
      orderId: body.order_id,
      statusCode: body.status_code,
      grossAmount: body.gross_amount,
      hasServerKey: !!serverKey,
      receivedSignature: signature,
    });

    const signatureKey =
      body.order_id + body.status_code + body.gross_amount + serverKey;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(signatureKey)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Signature mismatch:", {
        received: signature,
        expected: expectedSignature,
      });
      return;
    }

    console.log("Signature verified successfully");

    // Handle the notification
    const { transaction_status, order_id } = body;
    const metadata = body.metadata;

    console.log("Processing transaction:", {
      status: transaction_status,
      orderId: order_id,
      metadata,
    });

    // Only process successful transactions
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      console.log("Transaction is successful, proceeding with credit update");

      if (!metadata || !metadata.userId || !metadata.credits) {
        console.error("Missing required metadata:", metadata);
        return;
      }

      const { userId, credits } = metadata;
      console.log("Starting credit update for user:", userId);

      // Update user credits in the database
      console.log("Fetching existing credits from Supabase...");
      const { data: existingCredits, error: fetchError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .single();

      console.log("Supabase fetch response:", {
        data: existingCredits,
        error: fetchError,
        userId,
      });

      if (fetchError) {
        console.error("Supabase fetch error details:", {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
        });
        return;
      }

      console.log("Current credits:", existingCredits?.credits);

      const newCredits = (existingCredits?.credits || 0) + credits;
      console.log("Calculated new credits:", newCredits);

      console.log("Attempting to upsert credits to Supabase...");
      const { data: updateData, error: updateError } = await supabase
        .from("user_credits")
        .upsert(
          {
            user_id: userId,
            credits: newCredits,
          },
          {
            onConflict: "user_id",
          }
        )
        .select(); // Add this to see the updated data

      console.log("Supabase update response:", {
        data: updateData,
        error: updateError,
        userId,
        newCredits,
      });

      if (updateError) {
        console.error("Supabase update error details:", {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
        });
        return;
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
      } else {
        console.log("Transaction logged successfully");
      }

      // Trigger credit update to refresh the UI
      triggerCreditUpdate(userId);
      console.log("Credit update triggered for UI refresh");
    } else {
      console.log(
        "Transaction status not settlement/capture:",
        transaction_status
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
  }
}
