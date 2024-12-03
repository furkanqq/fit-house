import { NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

export async function GET() {
  const db = await connectDB();
  const users = await db.all("SELECT * FROM users");
  return NextResponse.json(users, { status: 200 });
}
