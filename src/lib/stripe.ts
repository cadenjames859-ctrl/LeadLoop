import Stripe from "stripe";

// Lazily constructed so importing this module never throws just because
// STRIPE_SECRET_KEY isn't set yet — only code paths that actually need
// Stripe (checkout, billing portal, webhook) fail, and only when invoked.
let cachedClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (cachedClient) return cachedClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment to enable billing."
    );
  }
  cachedClient = new Stripe(key);
  return cachedClient;
}

export function isBillingConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID_PRO);
}

export function getAppUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}
