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
      limiter: Ratelimit.fixedWindow(50, "1440 m"),
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
    }

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

    const getPrompt = (room: string, theme: string) => {
      if (room === "Gaming Room") {
        return "a modern gaming room with ergonomic gaming chairs, dual or triple monitors on a sleek desk, RGB lighting, a wall-mounted TV, gaming consoles, shelves for accessories, clean and organized setup";
      }
      return `a realistic, functional ${theme.toLowerCase()} ${room.toLowerCase()} with high-quality furniture, practical layout, and natural lighting`;
    };

    const JagilleyV =
      "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b";
    const UsamEhsan =
      "51778c7522eb99added82c0c52873d7a391eecf5fcc3ac7856613b7e6443f2f7";

    // Call Replicate for image generation
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: UsamEhsan,
        input: {
          image: imageUrl,
          prompt: getPrompt(room, theme),
          strength: 0.5,
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

    // Only deduct credits if image generation was successful and we're using credits
    if (useCredits && generatedImage) {
      const { data: userCredits, error: creditsError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      if (creditsError) {
        console.error("Error fetching user credits:", creditsError);
        // Still return the generated image even if credit deduction fails
        return NextResponse.json(generatedImage);
      }

      // Deduct 1 credit from user's account
      const { error: updateError } = await supabase
        .from("user_credits")
        .update({ credits: userCredits.credits - 1 })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating user credits:", updateError);
        // Still return the generated image even if credit deduction fails
        return NextResponse.json(generatedImage);
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
