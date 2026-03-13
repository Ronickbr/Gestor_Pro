import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { planId, userEmail, userId, planName, amount } = await req.json();

    const INFINITEPAY_HANDLE = "rnbudel_pay";
    const REDIRECT_URL = `${req.headers.get("origin")}/payment-success`;
    const WEBHOOK_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/infinitepay-webhook`;

    // Map amounts to cents
    // amount is string like "59,90"
    const amountInCents = Math.round(parseFloat(amount.replace(",", ".")) * 100);

    // Create Checkout Link via InfinitePay Public API
    const response = await fetch("https://api.infinitepay.io/invoices/public/checkout/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        redirect_url: REDIRECT_URL,
        webhook_url: WEBHOOK_URL,
        order_nsu: `${userId}:${planId}:${Date.now()}`, // Format: userId:planId:timestamp
        items: [
          {
            description: `Assinatura Gestor Pro - Plano ${planName}`,
            quantity: 1,
            price: amountInCents,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("InfinitePay Error:", data);
      throw new Error(data.message || "Erro ao criar link no InfinitePay");
    }

    return new Response(JSON.stringify({ init_point: data.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
