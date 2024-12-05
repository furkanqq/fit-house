import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json(); // Gönderilen kullanıcı ID'sini al
  const db = await connectDB();

  // Kullanıcıyı veritabanından sil
  await db.run("DELETE FROM users WHERE id = ?", [userId]);

  return NextResponse.json(
    { message: "Kullanıcı başarıyla silindi" },
    { status: 200 }
  );
}
