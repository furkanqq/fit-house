import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/utils/sendMail";
import { UserMailConfigTypes } from "@/types";

export async function POST(req: NextRequest) {
  const { email, config } = await req.json();

  const userMailConfig: UserMailConfigTypes = {
    username: process.env.SMTP_MAIL as string,
    password: process.env.SMTP_PASS as string,
    port: process.env.SMTP_PORT as unknown as number,
    host: process.env.SMTP_HOST as string,
  };

  await sendMail(
    email,
    config?.htmlFile,
    config?.mailRequest,
    userMailConfig
  );

  return NextResponse.json(
    { message: "Ders sayısı güncellendi" },
    { status: 200 }
  );
}
