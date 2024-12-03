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
    username: "furkanilhanresmi@gmail.com",
    password: "lojlpkfdnuoadnsn",
    port: 587,
    host: "smtp.gmail.com",
  };

  if (user.remainingLessons === 2) {
    // await sendEmail(user.email, "Ders Uyarısı", "Kalan dersleriniz 2!");
    console.log("seeee");
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
