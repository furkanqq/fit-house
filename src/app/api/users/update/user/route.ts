import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/index.mjs"; // Veritabanı bağlantısı

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

    // ID'nin sağlandığını kontrol et
    if (!id) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si belirtilmeli." },
        { status: 400 }
      );
    }

    // Veritabanı bağlantısını al
    const client = await pool.connect();

    try {
      // Kullanıcıyı kontrol et
      const user = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);

      if (user.rowCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı." },
          { status: 404 }
        );
      }

      const currentUser = user.rows[0];

      // Güncellenecek alanları ayarla
      const updatedName = name ?? currentUser.name;
      const updatedEmail = email ?? currentUser.email;
      const updatedLessons = remainingLessons ?? currentUser.remainingLessons;

      // Güncelleme sorgusunu çalıştır
      const updateResult = await client.query(
        "UPDATE users SET name = $1, email = $2, remainingLessons = $3 WHERE id = $4",
        [updatedName, updatedEmail, updatedLessons, id]
      );

      // Güncelleme sonucu kontrol et
      if (updateResult.rowCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı bilgileri güncellenirken bir hata oluştu." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Kullanıcı bilgileri başarıyla güncellendi." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Veritabanı işlemi sırasında hata:", error);
      return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
    } finally {
      client.release(); // Bağlantıyı serbest bırak
    }
  } catch (error) {
    console.error("Genel hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
