import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const payload = await req.json();
    console.log("InfinitePay Webhook Payload:", payload);

    const { order_nsu, invoice_slug, status } = payload;

    if (!order_nsu) {
      return new Response("Missing order_nsu", { status: 400 });
    }

    // Parse order_nsu: userId:planId:timestamp
    const [userId, planId] = order_nsu.split(":");

    if (!userId || !planId) {
      console.error("Invalid order_nsu format:", order_nsu);
      return new Response("Invalid order_nsu", { status: 400 });
    }

    // Update User Profile
    // We assume if it's in the webhook, we should check status
    // Common InfinitePay status for success: "paid" or presence of transaction data
    const isPaid = status === "paid" || payload.paid_amount > 0;

    if (isPaid) {
      // Calculate ends_at based on plan
      let durationDays = 30;
      if (planId === 'semestral') durationDays = 180;
      if (planId === 'anual') durationDays = 365;

      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + durationDays);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          subscription_plan: planId,
          subscription_activated_at: new Date().toISOString(),
          subscription_ends_at: endsAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      // Log the event
      await supabase.from("subscription_audit_logs").insert({
        user_id: userId,
        event: "payment_success",
        plan: planId,
        details: { invoice_slug, payload },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
