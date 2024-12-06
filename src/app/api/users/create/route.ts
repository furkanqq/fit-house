import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/index.mjs";

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
    const client = await pool.connect();

    try {
      // Yeni kullanıcı ekle
      const result = await client.query(
        "INSERT INTO users (name, email, remainingLessons) VALUES ($1, $2, $3) RETURNING id",
        [name, email, remainingLessons]
      );

      const newUserId = result.rows[0].id; // PostgreSQL'de, 'RETURNING id' ile id'yi alıyoruz

      return NextResponse.json(
        { message: "Kullanıcı başarıyla oluşturuldu.", id: newUserId },
        { status: 201 }
      );
    } catch (error) {
      console.error("Kullanıcı oluşturulurken hata oluştu:", error);
      return NextResponse.json(
        { error: "Kullanıcı oluşturulamadı." },
        { status: 500 }
      );
    } finally {
      client.release(); // Bağlantıyı serbest bırak
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
