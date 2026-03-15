import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.DASHBOARD_PASSWORD;

  // If no password is configured, allow access (dev convenience)
  if (!expected || password === expected) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("dashboard_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
