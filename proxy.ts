import { auth } from "@/lib/auth/server";

// In Next.js 16.1.6, middleware.ts is replaced by proxy.ts
// The proxy function handles global route protection
export const proxy = auth.middleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [
        { type: "header", key: "next-action" }
      ],
    },
  ],
};
