"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, getAppUrl } from "@/lib/stripe";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
}

export async function createCheckoutSessionAction() {
  const user = await requireUser();
  const priceId = process.env.STRIPE_PRICE_ID_PRO;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID_PRO is not configured.");
  }
  const stripe = getStripe();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${getAppUrl()}/settings?upgraded=1`,
    cancel_url: `${getAppUrl()}/settings`,
    client_reference_id: user.id,
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(checkoutSession.url);
}

export async function createBillingPortalSessionAction() {
  const user = await requireUser();

  if (!user.stripeCustomerId) {
    throw new Error("No billing account found for this user yet.");
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getAppUrl()}/settings`,
  });

  redirect(portalSession.url);
}
