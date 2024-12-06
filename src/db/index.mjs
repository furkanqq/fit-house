// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import path from "path";
// import fs from "fs";
// import os from "os";

// const connectDB = async () => {
//   const dbPath = path.resolve(process.cwd(), "database.sqlite");
//   const tempDbPath = path.join(os.tmpdir(), "database.sqlite");

//   // Veritabanını geçici dizine kopyala
//   if (!fs.existsSync(tempDbPath)) {
//     fs.copyFileSync(dbPath, tempDbPath);
//     console.log("Database copied to:", tempDbPath);
//   }

//   // Veritabanına bağlan
//   return open({
//     filename: tempDbPath,
//     driver: sqlite3.Database,
//   });
// };

// export default connectDB;

import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

console.log(process.env.DATABASE_URL, "process.env.DATABASE_URL");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // .env dosyasından okur
});

pool
  .connect()
  .then(() => console.log("Bağlantı başarılı"))
  .catch((err) => console.error("Bağlantı hatası:", err));

export default pool;
