import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dim shadow-sm shadow-primary/20",
  secondary:
    "bg-white text-ink border border-line hover:border-ink-faint hover:bg-paper-raised",
  ghost: "text-ink-soft hover:text-ink hover:bg-line-soft",
  danger: "bg-danger text-white hover:brightness-95",
  "danger-ghost": "text-danger hover:bg-danger-tint",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, VARIANTS[variant], SIZES[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}
