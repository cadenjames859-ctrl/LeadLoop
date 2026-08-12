import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Stripe moved billing-period fields onto each subscription item (to support
// multi-item subscriptions with different cycles) rather than the top-level
// subscription object — this reads the current period end from the first item.
function currentPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const seconds = subscription.items.data[0]?.current_period_end;
  return seconds ? new Date(seconds * 1000) : null;
}

function planForStatus(status: Stripe.Subscription.Status): {
  plan: "FREE" | "PRO";
  subscriptionStatus: "NONE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
} {
  switch (status) {
    case "active":
    case "trialing":
      return { plan: "PRO", subscriptionStatus: "ACTIVE" };
    case "past_due":
    case "unpaid":
      return { plan: "PRO", subscriptionStatus: "PAST_DUE" };
    case "canceled":
    case "incomplete_expired":
      return { plan: "FREE", subscriptionStatus: "CANCELED" };
    default:
      return { plan: "FREE", subscriptionStatus: "NONE" };
  }
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) return;

  const { plan, subscriptionStatus } = planForStatus(subscription.status);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      subscriptionStatus,
      stripeSubscriptionId: subscription.id,
      stripeCurrentPeriodEnd: currentPeriodEnd(subscription),
    },
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "FREE", subscriptionStatus: "CANCELED" },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
