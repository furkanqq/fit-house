import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// SQLite bağlantısı
const connectDB = async () => {
  return open({
    filename: path.resolve(process.cwd(), "database.sqlite"), // Mutlak yol
    driver: sqlite3.Database,
  });
};

export default connectDB;
