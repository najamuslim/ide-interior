import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getGeneratedImage,
  saveGeneratedImage,
} from "../../utils/redis-helpers";
import { themeType, roomType } from "../../utils/dropdownTypes";

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      // 100 requests per hour per IP
      // Masih reasonable untuk mencegah abuse tapi tidak mengganggu pengguna normal
      limiter: Ratelimit.fixedWindow(100, "3600 s"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  try {
    const { imageUrl, theme, room, orderId } = await request.json();

    if (!imageUrl || !theme || !room) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check if image already in Redis cache
    if (orderId) {
      const cachedResponse = await getGeneratedImage(orderId);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    }

    console.log("No cached response found, generating new image");

    //Rate Limiter Code
    if (ratelimit) {
      const headersList = headers();
      const ipIdentifier = headersList.get("x-real-ip");

      const result = await ratelimit.limit(ipIdentifier ?? "");

      if (!result.success) {
        return new Response("Too many requests. Please try again in an hour.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        });
      }
    }

    const getPrompt = (room: string, theme: string) => {
      if (room === "Gaming Room") {
        return "a modern gaming room with ergonomic gaming chairs, dual or triple monitors on a sleek desk, RGB lighting, a wall-mounted TV, gaming consoles, shelves for accessories, clean and organized setup";
      }
      return `a realistic, functional ${theme.toLowerCase()} ${room.toLowerCase()} with high-quality furniture, practical layout, and natural lighting`;
    };

    let startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.REPLICATE_API_KEY,
        },
        body: JSON.stringify({
          version:
            "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
          input: {
            image: imageUrl,
            prompt: getPrompt(room, theme),
            a_prompt:
              "best quality, ultra-detailed, photo from Pinterest, interior, realistic furniture, natural lighting, cinematic photo, ultra-realistic, award-winning, lifelike materials, functional design, symmetrical layout",
            n_prompt:
              "longbody, lowres, bad anatomy, unrealistic shapes, disproportionate furniture, floating objects, distorted layout, bad lighting, extra elements, poor quality, low quality",
          },
        }),
      }
    );

    let jsonStartResponse = await startResponse.json();
    let endpointUrl = jsonStartResponse.urls.get;

    // GET request to get the status of the image restoration process
    let restoredImage: string | null = null;
    while (!restoredImage) {
      console.log("polling for result...");
      let finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.REPLICATE_API_KEY,
        },
      });
      let jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        restoredImage = jsonFinalResponse.output;
        // Save complete response to Redis
        if (orderId) {
          await saveGeneratedImage(orderId, JSON.stringify(restoredImage));
        }
        break;
      } else if (jsonFinalResponse.status === "failed") {
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json(
      restoredImage ? restoredImage : "Failed to restore image"
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
