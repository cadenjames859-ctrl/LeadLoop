import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/app/SignOutButton";
import { initials, formatDate } from "@/lib/utils";
import { IconSparkles, IconCheckCircle } from "@/components/ui/icons";
import { isBillingConfigured } from "@/lib/stripe";
import { createCheckoutSessionAction, createBillingPortalSessionAction } from "@/lib/actions/billing";
import { FREE_PLAN_ACTIVE_LEAD_LIMIT, PLAN_LABEL } from "@/lib/plan";

export default async function SettingsPage({
  searchParams,
}: PageProps<"/settings">) {
  const sp = await searchParams;
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session!.user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      plan: true,
      subscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  const aiConfigured = Boolean(process.env.AI_API_KEY);
  const billingConfigured = isBillingConfigured();
  const justUpgraded = sp.upgraded === "1";

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, plan, and integrations." />

      <div className="space-y-6">
        {justUpgraded ? (
          <div className="flex items-center gap-2 rounded-[var(--radius-card)] border border-primary/20 bg-primary-tint px-4 py-3 text-sm font-medium text-primary">
            <IconCheckCircle className="h-4 w-4 shrink-0" />
            You&rsquo;re on Pro! It may take a few seconds for your plan to update below.
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-tint text-lg font-semibold text-primary">
                {initials(user.name)}
              </div>
              <div>
                <p className="font-medium text-ink">{user.name}</p>
                <p className="text-sm text-ink-soft">{user.email}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  Member since {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-5 border-t border-line-soft pt-5">
              <SignOutButton />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan &amp; Billing</CardTitle>
            <Badge
              className={
                user.plan === "PRO"
                  ? "bg-primary-tint text-primary ring-primary/20"
                  : "bg-line-soft text-ink-soft ring-ink-faint/20"
              }
            >
              {PLAN_LABEL[user.plan]}
            </Badge>
          </CardHeader>
          <CardBody>
            {!billingConfigured ? (
              <p className="text-sm text-ink-faint">
                Billing isn&rsquo;t configured yet. Everyone is on the Free plan until Stripe is
                connected.
              </p>
            ) : user.plan === "PRO" ? (
              <div className="space-y-4">
                <p className="text-sm text-ink-soft">
                  You&rsquo;re on the Pro plan
                  {user.subscriptionStatus === "PAST_DUE" ? (
                    <span className="text-danger"> — your last payment failed. Update your card to avoid losing access.</span>
                  ) : user.stripeCurrentPeriodEnd ? (
                    <> — renews {formatDate(user.stripeCurrentPeriodEnd)}.</>
                  ) : (
                    "."
                  )}
                </p>
                <form action={createBillingPortalSessionAction}>
                  <Button type="submit" variant="secondary" size="sm">
                    Manage Billing
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-ink-soft">
                  You&rsquo;re on the Free plan — up to {FREE_PLAN_ACTIVE_LEAD_LIMIT} active leads,
                  basic follow-up reminders. Upgrade to Pro for unlimited leads and follow-up
                  message drafts.
                </p>
                <form action={createCheckoutSessionAction}>
                  <Button type="submit" size="sm">
                    Upgrade to Pro — $29/month
                  </Button>
                </form>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-Up Message Generation</CardTitle>
            <Badge
              className={
                aiConfigured
                  ? "bg-primary-tint text-primary ring-primary/20"
                  : "bg-line-soft text-ink-soft ring-ink-faint/20"
              }
            >
              {aiConfigured ? "AI connected" : "Demo mode"}
            </Badge>
          </CardHeader>
          <CardBody>
            <div className="flex gap-3 text-sm text-ink-soft">
              <IconSparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                {user.plan === "FREE"
                  ? "Follow-up message drafts are a Pro feature. Upgrade above to start generating them."
                  : aiConfigured
                    ? "LeadLoop is generating follow-up messages using your connected AI provider."
                    : "LeadLoop is generating follow-up messages with its built-in demo writer. Add an AI_API_KEY environment variable to connect a real AI provider — no code changes needed beyond src/lib/ai/followUp.ts."}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="grid grid-cols-1 gap-2 text-sm text-ink-soft sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /> SMS follow-ups
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /> Online booking
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /> Team accounts
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
