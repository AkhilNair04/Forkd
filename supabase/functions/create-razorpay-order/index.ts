import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="npm:@types/node"
import { Buffer } from "node:buffer";

serve(async (req: Request) => {
  const { amount, user_id } = await req.json();

  // 1. Get discount from your teammate's API
  let discount = 0;
  try {
    const discountRes = await fetch(
      `https://tzmgwmadzhtbyqykliah.supabase.co/functions/v1/discount`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      }
    );
    const discountData = await discountRes.json();
    if (discountData && discountData.discount) {
      discount = discountData.discount;
    }
  } catch (e) {
    // If discount API fails, just continue without discount
    discount = 0;
  }

  // 2. Apply discount to amount (amount is in paise)
  const finalAmount = Math.max(0, amount - discount);

  // 3. Prepare Razorpay order
  // @ts-ignore
  const key_id = Deno.env.get("RAZORPAY_KEY_ID")!;
  // @ts-ignore
  const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const basicAuth = "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": basicAuth,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: finalAmount,
      currency: "INR",
      receipt: "order_rcptid_11"
    })
  });

  const data = await response.json();

  // 4. Return both the order and the discount used
  return new Response(
    JSON.stringify({
      ...data,
      discount_applied: discount,
      final_amount: finalAmount
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
