import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "@/components/app/SignOutButton";
import { initials, formatDate } from "@/lib/utils";
import { IconSparkles } from "@/components/ui/icons";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session!.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  const aiConfigured = Boolean(process.env.AI_API_KEY);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and integrations." />

      <div className="space-y-6">
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
                {aiConfigured
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
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /> Payments
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
