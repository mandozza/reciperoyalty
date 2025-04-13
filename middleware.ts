import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rate-limit";
import csrf from "edge-csrf";

// Initialize CSRF protection
const csrfProtect = csrf({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    name: "__Host-csrf",
    sameSite: "lax",
  },
});

// Combine auth middleware with security middleware
async function middleware(request: NextRequest) {
  // Apply rate limiting to auth routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const result = await rateLimit(request);

    if (!result.success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          ...result.headers,
          "Retry-After": Math.ceil(result.reset).toString(),
        },
      });
    }
  }

  // Apply CSRF protection to mutation endpoints
  if (request.method !== "GET" && request.method !== "HEAD") {
    const csrfError = await csrfProtect(request, NextResponse.next());

    if (csrfError) {
      return new NextResponse("Invalid CSRF Token", { status: 403 });
    }
  }

  // Clone the response to add headers
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = {
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-XSS-Protection": "1; mode=block",
    // Add CSP header
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s+/g, " ").trim(),
  };

  // Add headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Export the middleware wrapped with auth
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth/signin",
  },
});

// Specify which routes to apply middleware to
export const config = {
  matcher: [
    "/api/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
