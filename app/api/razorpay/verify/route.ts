import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: Request) {
  try {
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const key_secret = rawKeySecret?.trim();
    if (!key_secret) {
      return NextResponse.json(
        { error: "Razorpay secret key is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      quantity = 1,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // 1. Compute HMAC SHA256 Signature
    const dataToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(dataToSign)
      .digest("hex");

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (!isAuthentic) {
      console.error("Razorpay signature mismatch:", {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, error: "Payment verification failed: Invalid signature." },
        { status: 400 }
      );
    }

    // 2. Decrement Sanity Stock automatically if valid product
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    let updatedStock: number | undefined;

    if (productId && typeof productId === "string" && !productId.startsWith("le-") && process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const patched = await serverClient
          .patch(productId)
          .dec({ availableStock: qty })
          .commit();

        updatedStock = patched.availableStock;

        if (updatedStock !== undefined && updatedStock < 0) {
          await serverClient
            .patch(productId)
            .set({ availableStock: 0 })
            .commit();
        }
      } catch (sanityErr) {
        console.error("Failed to automatically update stock in Sanity:", sanityErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and recorded.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      updatedStock,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Payment verification route exception:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal verification server error." },
      { status: 500 }
    );
  }
}
