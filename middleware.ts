import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Define admin-only routes (require ADMIN role)
    const adminOnlyRoutes = [
      "/admin/users",
      "/admin/settings",
      "/admin/products",
      "/admin/news",
      "/admin/banners",
      "/admin/downloads",
      "/admin/partners",
      "/admin/industries",
    ];

    // Define routes that ADMIN and ANALYST can access
    const analystAccessibleRoutes = ["/admin", "/dashboard"];

    // Check if it's an admin-only route
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
      path.startsWith(route)
    );

    // Check if it's an analyst-accessible route
    const isAnalystRoute = analystAccessibleRoutes.some((route) =>
      path.startsWith(route)
    );

    // ADMIN role can access everything
    if (token?.role === "ADMIN") {
      return NextResponse.next();
    }

    // ANALYST can access dashboard but not admin modules
    if (token?.role === "ANALYST") {
      // Allow access to dashboard
      if (isAnalystRoute) {
        return NextResponse.next();
      }
      // Block access to admin modules
      if (isAdminOnlyRoute) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
      return NextResponse.next();
    }

    // USER role - redirect to home or 403
    if (token?.role === "USER") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // No valid role - let NextAuth handle redirect to login
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        if (
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname === "/404" ||
          pathname === "/403"
        ) {
          return true;
        }

        // Admin routes require authentication
        if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth)).*)",
  ],
};
