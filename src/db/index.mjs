import sqlite3 from "sqlite3";
import { open } from "sqlite";

// SQLite bağlantısı
const connectDB = async () => {
  return open({
    filename: "./database.sqlite", // Veritabanı dosyası
    driver: sqlite3.Database,
  });
};

export default connectDB;
