import Link from "next/link";
import { Logo } from "@/components/app/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <a href="#how-it-works" className="hover:text-ink">
            How it works
          </a>
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#pricing" className="hover:text-ink">
            Pricing
          </a>
          <a href="#faq" className="hover:text-ink">
            FAQ
          </a>
          <Link href="/login" className="hover:text-ink">
            Log in
          </Link>
        </nav>
        <p className="text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} LeadLoop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
