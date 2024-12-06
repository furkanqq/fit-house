import { NextResponse } from "next/server";
import pool from "@/db/index.mjs";

export async function GET() {
  const client = await pool.connect(); // Bağlantıyı al
  try {
    // PostgreSQL sorgusu
    const result = await client.query("SELECT * FROM users");
    const users = result.rows; // PostgreSQL sorgusu sonucunda gelen veriler 'rows' içinde yer alır.

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 }
    );
  } finally {
    client.release(); // Bağlantıyı serbest bırak
  }
}
