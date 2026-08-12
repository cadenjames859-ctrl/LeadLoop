import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/follow-ups/:path*", "/settings/:path*"],
};
