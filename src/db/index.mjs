import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import os from "os";

const connectDB = async () => {
  const dbPath = path.resolve(process.cwd(), "database.sqlite");
  const tempDbPath = path.join(os.tmpdir(), "database.sqlite");

  // Veritabanını geçici dizine kopyala
  if (!fs.existsSync(tempDbPath)) {
    fs.copyFileSync(dbPath, tempDbPath);
    console.log("Database copied to:", tempDbPath);
  }

  // Veritabanına bağlan
  return open({
    filename: tempDbPath,
    driver: sqlite3.Database,
  });
};

export default connectDB;
