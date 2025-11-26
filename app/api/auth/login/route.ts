import User from "@/database/user.model";
import { loginUser } from "@/lib/actions/user.action";
import { NextRequest, NextResponse } from "next/server";

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: Omit<typeof User, "password">;
}

// The actual API route function
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await loginUser(email, password);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Erreur du serveur" }, { status: 500 });
  }
}