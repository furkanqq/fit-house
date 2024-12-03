import connectDB from "./index.mjs";

async function seedDB() {
  const db = await connectDB();

  // Örnek kullanıcılar ekle
  const users = [
    {
      name: "Ali Veli",
      email: "furkan.llhan@hotmail.com",
      remainingLessons: 5,
    },
    {
      name: "Ayşe Yılmaz",
      email: "furkan.llhan@hotmail.com",
      remainingLessons: 3,
    },
    {
      name: "Mehmet Kaya",
      email: "furkan.llhan@hotmail.com",
      remainingLessons: 7,
    },
  ];

  for (const user of users) {
    await db.run(
      `INSERT INTO users (name, email, remainingLessons) VALUES (?, ?, ?)`,
      [user.name, user.email, user.remainingLessons]
    );
  }

  console.log("Örnek veriler eklendi.");
}

seedDB().catch((err) => {
  console.error("Veriler eklenirken hata oluştu:", err);
});
