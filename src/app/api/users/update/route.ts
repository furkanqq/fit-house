import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/index.mjs"; // PostgreSQL bağlantısı
import { sendMail } from "@/utils/sendMail";
import { UserMailConfigTypes } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId, config } = await req.json();

    // Gerekli config verilerinin doğruluğunu kontrol et
    if (!config?.htmlFile || !config?.mailRequest) {
      return NextResponse.json(
        { error: "HTML içeriği veya mail talebi eksik." },
        { status: 400 }
      );
    }

    // Veritabanına bağlan
    const client = await pool.connect();

    try {
      // Kullanıcıyı güncelle
      const updateResult = await client.query(
        "UPDATE users SET remainingLessons = remainingLessons - 1 WHERE id = $1",
        [userId]
      );

      // Eğer kullanıcı bulunamazsa hata döndür
      if (updateResult.rowCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı." },
          { status: 404 }
        );
      }

      // Güncellenen kullanıcıyı al
      const userResult = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );

      const user = userResult.rows[0];

      // E-posta ayarları
      const userMailConfig: UserMailConfigTypes = {
        username: process.env.SMTP_MAIL as string,
        password: process.env.SMTP_PASS as string,
        port: process.env.SMTP_PORT as unknown as number,
        host: process.env.SMTP_HOST as string,
      };

      // Kalan ders sayısı 2'ye eşitse, e-posta gönder
      if (user.remainingLessons === 2) {
        await sendMail(
          user.email,
          config?.htmlFile,
          config?.mailRequest,
          userMailConfig
        );
      }

      return NextResponse.json(
        { message: "Ders sayısı güncellendi" },
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
