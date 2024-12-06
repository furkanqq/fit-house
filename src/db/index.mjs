import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

// SQLite bağlantısı
const connectDB = async () => {
  const dbPath = path.resolve(process.cwd(), "database.sqlite");

  // Veritabanı dosyasının var olup olmadığını kontrol et
  console.log("Database Path:", dbPath);
  console.log("Database Exists:", fs.existsSync(dbPath));

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

export default connectDB;
