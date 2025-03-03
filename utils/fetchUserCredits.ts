import { supabase } from "./supabaseClient";

// Add this to store refetch callbacks
const creditUpdateCallbacks: ((userId: string) => void)[] = [];

export async function fetchUserCredits(userId: string): Promise<number> {
  try {
    // First try to get existing user credits
    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    // If user not found, create new entry with 1 free credit
    if (error && error.code === "PGRST116") {
      const { data: newUser, error: insertError } = await supabase
        .from("user_credits")
        .insert({
          user_id: userId,
          credits: 1, // Give 1 free credit
        })
        .select("credits")
        .single();

      if (insertError) {
        console.error("Error creating new user credits:", insertError);
        return 0;
      }

      // Log the free credit transaction
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        credits_added: 1,
        transaction_status: "free_credit",
        order_id: `free_${userId}`,
      });

      return newUser?.credits || 1;
    }

    if (error) {
      console.error("Error fetching user credits:", error);
      return 0;
    }

    return data?.credits || 0;
  } catch (error) {
    console.error("Failed to fetch user credits:", error);
    return 0;
  }
}

// Add this function to trigger credit updates
export function triggerCreditUpdate(userId: string) {
  creditUpdateCallbacks.forEach((callback) => callback(userId));
}

// Add this function to register for credit updates
export function onCreditUpdate(callback: (userId: string) => void) {
  creditUpdateCallbacks.push(callback);
  return () => {
    const index = creditUpdateCallbacks.indexOf(callback);
    if (index > -1) {
      creditUpdateCallbacks.splice(index, 1);
    }
  };
}
