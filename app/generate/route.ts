import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "../../utils/supabaseClient";

// Create a ratelimit of 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  try {
    // Get user authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const { imageUrl, theme, room, useCredits } = await request.json();

    // Check if all required fields are provided
    if (!imageUrl || !theme || !room) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If using credits, check if user has enough credits
    if (useCredits) {
      const { data: userCredits, error: creditsError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      if (creditsError) {
        console.error("Error fetching user credits:", creditsError);
        return NextResponse.json(
          { error: "Failed to check credits" },
          { status: 500 }
        );
      }

      // Check if user has enough credits
      if (!userCredits || userCredits.credits < 1) {
        return NextResponse.json(
          { error: "insufficient_credits" },
          { status: 400 }
        );
      }

      // Deduct 1 credit from user's account
      const { error: updateError } = await supabase
        .from("user_credits")
        .update({ credits: userCredits.credits - 1 })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating user credits:", updateError);
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }

      // Log the credit usage
      const { error: logError } = await supabase
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          order_id: `generation_${Date.now()}`,
          credits_added: -1, // Negative value for usage
          transaction_status: "completed",
        });

      if (logError) {
        console.error("Error logging credit usage:", logError);
      }
    } else {
      // Apply rate limiting if not using credits
      if (ratelimit) {
        const headersList = headers();
        const ipIdentifier = headersList.get("x-real-ip");
        const identifier = ipIdentifier ?? user.id;

        const result = await ratelimit.limit(identifier);

        if (!result.success) {
          return NextResponse.json(
            {
              error:
                "Too many requests. Please try again later or purchase credits.",
            },
            { status: 429 }
          );
        }
      }
    }

    // Call Replicate for image generation
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version:
          "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
        input: {
          image: imageUrl,
          prompt: `${theme} style ${room}`,
          a_prompt:
            "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    const pollingUrl = prediction.urls.get;

    // Poll for the result
    let generatedImage = null;
    while (!generatedImage) {
      const pollResponse = await fetch(pollingUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      });
      const pollResult = await pollResponse.json();

      if (pollResult.status === "succeeded") {
        generatedImage = pollResult.output;
        break;
      } else if (pollResult.status === "failed") {
        throw new Error("Image generation failed");
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return NextResponse.json(generatedImage);
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
