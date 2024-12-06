import pool from "./index.mjs"; // Veritabanı bağlantısını import et

const createTable = async () => {
  const client = await pool.connect(); // Bağlantıyı al
  try {
    // Veritabanında tabloyu oluştur
    await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        remainingLessons INTEGER NOT NULL
      )
    `);
    console.log("Users tablosu başarıyla oluşturuldu!");
  } catch (err) {
    console.error("Tablo oluşturulurken bir hata oluştu:", err);
  } finally {
    client.release(); // Bağlantıyı serbest bırak
  }
};

// Başlangıçta tabloyu oluşturmak için çalıştır
createTable().catch((err) => console.error("Migration hatası:", err));
