import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { AUTH_SECRET } from "@/lib/auth/secret";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");

    // ADMIN role passes through everywhere.
    if (token?.role === "ADMIN") {
      return NextResponse.next();
    }

    // Any non-ADMIN trying to reach /admin is redirected to 403.
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    // Without a secret the middleware redirects every request to
    // pages.error with error=Configuration. Share the same resolution as
    // lib/auth/options.ts so a missing NEXTAUTH_SECRET cannot silently
    // take the whole site down on preview deployments.
    secret: AUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes (always allowed).
        if (
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname === "/404" ||
          pathname === "/403"
        ) {
          return true;
        }

        // Admin routes require a valid session.
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth)).*)",
  ],
};
