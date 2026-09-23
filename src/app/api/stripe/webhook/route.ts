import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import z from "zod";

const metadataSchema = z.object({
  serviceId: z.uuid(),
  barbershopId: z.uuid(),
  userId: z.string(),
  date: z.iso.datetime(),
});

export const POST = async (request: Request) => {
  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_WEBHOOK_SECRET_KEY
  ) {
    console.error("STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const body = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY,
  ); // SHA256 HMAC signature
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = metadataSchema.parse(session.metadata);
    await prisma.booking.create({
      data: {
        serviceId: metadata.serviceId,
        barbershopId: metadata.barbershopId,
        userId: metadata.userId,
        date: metadata.date,
      },
    });
  }
  return NextResponse.json({ received: true });
};