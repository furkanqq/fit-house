import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/index.mjs";

import { sendMail } from "@/utils/sendMail";
import { UserMailConfigTypes } from "@/types";
import { User } from "@/app/page";

export async function POST(req: NextRequest) {
  const { config } = await req.json();
  const db = await connectDB();

  const users = await db.all("SELECT * FROM users");

  const userMailConfig: UserMailConfigTypes = {
    username: process.env.SMTP_MAIL as string,
    password: process.env.SMTP_PASS as string,
    port: process.env.SMTP_PORT as unknown as number,
    host: process.env.SMTP_HOST as string,
  };

  users.map(async (user: User) => {
    await sendMail(
      user?.email,
      config?.htmlFile,
      config?.mailRequest,
      userMailConfig
    );
  });

  return NextResponse.json({ message: "Gönderildi" }, { status: 200 });
}
