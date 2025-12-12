import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin/dashboard");
  const isLoginRoute = pathname.startsWith("/admin/login");

  // Block /admin without token
  if (isAdminRoute) {
    if (!token)
      return NextResponse.redirect(new URL("/admin/login", request.url));

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Block /login if already logged in
  if (isLoginRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch (e) {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
