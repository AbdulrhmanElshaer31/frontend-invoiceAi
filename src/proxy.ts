import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("session_data")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  /**
   */
  if (
    !sessionCookie &&
    (isProtectedRoute || (!isPublicRoute && pathname !== "/"))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   */
  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  /**
   */
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(sessionCookie ? "/home" : "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

