import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    // Protected routes that require authentication
    "/profile/:path*",
    "/recipes/create",
    "/recipes/edit/:path*",
    "/cookbooks/:path*",
    "/meal-plans/:path*",
    "/settings/:path*",
  ],
};
