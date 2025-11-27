import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  // Block /admin without token
  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Block /login if already logged in
  if (isLoginRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch (e) {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
