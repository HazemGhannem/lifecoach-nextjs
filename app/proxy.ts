import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // List of valid routes
  const validRoutes = ["/", "/booking", "/contact", "/login"];

  // If the route is not valid, redirect to home
  if (!validRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Otherwise, continue
  return NextResponse.next();
}
