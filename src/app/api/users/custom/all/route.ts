import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/index.mjs";
import { sendMail } from "@/utils/sendMail";
import { UserMailConfigTypes } from "@/types";
import { User } from "@/app/page";

export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json();

    // Config doğrulama
    if (!config?.htmlFile || !config?.mailRequest) {
      return NextResponse.json(
        { error: "HTML içeriği veya mail talebi eksik." },
        { status: 400 }
      );
    }

    // Veritabanına bağlan
    const client = await pool.connect();

    try {
      // Kullanıcıları al
      const result = await client.query("SELECT * FROM users");
      const users: User[] = result.rows; // Kullanıcıları alıyoruz

      const userMailConfig: UserMailConfigTypes = {
        username: process.env.SMTP_MAIL as string,
        password: process.env.SMTP_PASS as string,
        port: process.env.SMTP_PORT as unknown as number,
        host: process.env.SMTP_HOST as string,
      };

      // Asenkron mail gönderme işlemleri
      const sendMailPromises = users.map(async (user: User) =>
       await sendMail(
          user?.email,
          config?.htmlFile,
          config?.mailRequest,
          userMailConfig
        )
      );

      // Tüm mail gönderimlerinin tamamlanmasını bekleyelim
      await Promise.all(sendMailPromises);

      return NextResponse.json({ message: "Gönderildi" }, { status: 200 });
    } catch (error) {
      console.error("Mail gönderme sırasında hata:", error);
      return NextResponse.json(
        { error: "Mail gönderme hatası" },
        { status: 500 }
      );
    } finally {
      client.release(); // Bağlantıyı serbest bırak
    }
  } catch (error) {
    console.error("Genel hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
