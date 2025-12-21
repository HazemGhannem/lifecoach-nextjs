import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { error: "No token", success: false },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { message: "Token exists", success: true },
    { status: 200 }
  );
}

