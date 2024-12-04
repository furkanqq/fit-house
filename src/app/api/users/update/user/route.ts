import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

export async function PUT(req: NextRequest) {
  try {
    const {
      id,
      name,
      email,
      remainingLessons,
    }: {
      id: number;
      name?: string;
      email?: string;
      remainingLessons?: number;
    } = await req.json();

    // Girdi doğrulama
    if (!id) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si belirtilmeli." },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Kullanıcıyı kontrol et
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Güncellenecek alanları ayarla
    const updatedName = name ?? user.name;
    const updatedEmail = email ?? user.email;
    const updatedLessons = remainingLessons ?? user.remainingLessons;

    // Güncelleme sorgusu
    await db.run(
      "UPDATE users SET name = ?, email = ?, remainingLessons = ? WHERE id = ?",
      [updatedName, updatedEmail, updatedLessons, id]
    );

    return NextResponse.json(
      { message: "Kullanıcı bilgileri başarıyla güncellendi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
