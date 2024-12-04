import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

import { sendMail } from "@/utils/sendMail";
import { UserMailConfigTypes } from "@/types";

export async function POST(req: NextRequest) {
  const { userId, config } = await req.json();
  const db = await connectDB();

  // Kullanıcıyı güncelle
  await db.run(
    "UPDATE users SET remainingLessons = remainingLessons - 1 WHERE id = ?",
    [userId]
  );

  // Kalan ders sayısını kontrol et
  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);

  const userMailConfig: UserMailConfigTypes = {
    username: process.env.SMTP_MAIL as string,
    password: process.env.SMTP_PASS as string,
    port: process.env.SMTP_PORT as unknown as number,
    host: process.env.SMTP_HOST as string,
  };

  if (user.remainingLessons === 2) {
    // await sendEmail(user.email, "Ders Uyarısı", "Kalan dersleriniz 2!");
    await sendMail(
      user?.email,
      config?.htmlFile,
      config?.mailRequest,
      userMailConfig
    );
  }

  return NextResponse.json(
    { message: "Ders sayısı güncellendi" },
    { status: 200 }
  );
}