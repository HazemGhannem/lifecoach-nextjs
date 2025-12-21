// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Delete the token cookie (use same path as when it was set)
   response.cookies.delete({
     name: "token",
     path: "/admin",
     // Must match EXACTLY how it was set during login
   });

  return response;
}



