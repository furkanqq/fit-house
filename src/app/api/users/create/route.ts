import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      remainingLessons,
    }: { name: string; email: string; remainingLessons: number } =
      await req.json();

    // Girdi doğrulaması
    if (!name || !email || remainingLessons == null) {
      return NextResponse.json(
        {
          error:
            "Lütfen tüm gerekli bilgileri gönderin (name, email, remainingLessons).",
        },
        { status: 400 }
      );
    }

    // Veritabanına bağlan
    const db = await connectDB();

    // Yeni kullanıcı ekle
    const result = await db.run(
      "INSERT INTO users (name, email, remainingLessons) VALUES (?, ?, ?)",
      [name, email, remainingLessons]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Kullanıcı oluşturulamadı." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu.", id: result.lastID },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
