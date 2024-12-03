import { NextRequest, NextResponse } from "next/server";

const USERNAME = process.env.ADMIN_USERNAME;
const PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (username === USERNAME && password === PASSWORD) {
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("auth", "authenticated", {
      httpOnly: true, // Güvenlik için tarayıcıdan erişilemez
      maxAge: 60 * 60 * 24, // 1 gün
      sameSite: "strict",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
