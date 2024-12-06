// import connectDB from "./index.mjs";

// async function initDB() {
//   const db = await connectDB();
// //email unique
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       email TEXT NOT NULL,
//       remainingLessons INTEGER NOT NULL
//     )
//   `);

//   console.log("Database initialized.");
// }

// initDB().catch((err) => {
//   console.error("Database initialization failed:", err);
// });
