import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: Request) {
  try {
    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET;

    const key_id = rawKeyId?.trim();
    const key_secret = rawKeySecret?.trim();

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const body = await req.json();
    const { productId, quantity = 1, amount: customAmount, customer } = body;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    let pricePerUnit = 0;
    let productName = "Limited Edition Bio-Crafted Piece";

    // 1. If productId is provided, fetch product and verify stock in Sanity
    if (productId && typeof productId === "string" && !productId.startsWith("le-")) {
      try {
        const product = await serverClient.fetch(
          `*[_type == "limitedEdition" && _id == $id][0]`,
          { id: productId }
        );

        if (product) {
          productName = product.name || productName;
          if (product.isUpcoming) {
            return NextResponse.json(
              { error: `"${product.name}" is still cultivating and not yet released.` },
              { status: 400 }
            );
          }

          if (product.availableStock !== undefined && product.availableStock < qty) {
            return NextResponse.json(
              {
                error:
                  product.availableStock <= 0
                    ? `"${product.name}" is currently Sold Out.`
                    : `Only ${product.availableStock} piece${product.availableStock > 1 ? "s" : ""} left in stock.`,
              },
              { status: 400 }
            );
          }

          if (product.price && product.price > 0) {
            pricePerUnit = product.price;
          }
        }
      } catch (err) {
        console.warn("Could not fetch product from Sanity, falling back:", err);
      }
    }

    // Fallback to custom amount if Sanity price was not set
    if (!pricePerUnit && customAmount && customAmount > 0) {
      pricePerUnit = customAmount;
    }

    // Default demo fallback price if none set (e.g. ₹25,000)
    if (!pricePerUnit || pricePerUnit <= 0) {
      pricePerUnit = 25000;
    }

    const totalAmountInPaise = Math.round(pricePerUnit * qty * 100);

    if (totalAmountInPaise < 100) {
      return NextResponse.json(
        { error: "Order amount must be at least ₹1.00 (100 paise)." },
        { status: 400 }
      );
    }

    // 2. Create Razorpay order with complete customer & shipping metadata
    const orderOptions = {
      amount: totalAmountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      notes: {
        productId: productId || "custom",
        productName,
        quantity: qty.toString(),
        unitPrice: `₹${pricePerUnit.toLocaleString("en-IN")}`,
        customerName: customer?.name || "Anonymous Collector",
        customerEmail: customer?.email || "",
        customerPhone: customer?.phone || "",
        shippingAddress: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postalCode: customer?.postalCode || "",
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
      productName,
      unitPrice: pricePerUnit,
      quantity: qty,
    });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; error?: { description?: string }; message?: string };
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { error: err?.error?.description || err?.message || "Failed to create payment order." },
      { status: err?.statusCode || 500 }
    );
  }
}
