import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"];

// Protected routes that require authentication
const protectedRoutes = [
  "/home",
  "/dashboard",
  "/invoices",
  "/cost-center",
  "/expense-type",
  "/api-key",
];

export function proxy(request) {
  const sessionCookie = request.cookies.get("session_data")?.value;
  const pathname = request.nextUrl.pathname;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // If user is not authenticated and trying to access a protected route
  if (
    !sessionCookie &&
    (isProtectedRoute || (!isPublicRoute && pathname !== "/"))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access public routes (login, signup, etc.)
  if (sessionCookie && isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
