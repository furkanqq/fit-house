import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/index.mjs"; // Veritabanı bağlantısı

export async function DELETE(req: NextRequest) {
  try {
    const { userId }: { userId: number } = await req.json();

    // ID kontrolü
    if (!userId) {
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
        userId,
      ]);

      if (user.rowCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı." },
          { status: 404 }
        );
      }

      // Kullanıcıyı sil
      const deleteResult = await client.query(
        "DELETE FROM users WHERE id = $1",
        [userId]
      );

      // Silme sonucu kontrol et
      if (deleteResult.rowCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı silinirken bir hata oluştu." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Kullanıcı başarıyla silindi" },
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
