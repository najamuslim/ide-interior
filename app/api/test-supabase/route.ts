import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("user_credits")
      .select("count")
      .limit(1);

    return NextResponse.json({
      success: true,
      data,
      error,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      { status: 500 }
    );
  }
}
