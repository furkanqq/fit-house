import pool from "./index.mjs"; // Veritabanı bağlantısını import et

const createTable = async () => {
  const client = await pool.connect(); // Bağlantıyı al
  try {
    // Veritabanında tabloyu oluştur
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        qrCode VARCHAR(255),
        remaininglessons INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
