const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 📦 ensure DB path is stable (important for deployment)
const dbPath = path.join(__dirname, "profiles.db");
const db = new sqlite3.Database(dbPath);

// 🧱 create schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      gender TEXT CHECK(gender IN ('male','female')),
      gender_probability REAL,
      age INTEGER,
      age_group TEXT CHECK(age_group IN ('child','teenager','adult','senior')),
      country_id TEXT,
      country_name TEXT,
      country_probability REAL,
      created_at TEXT
    )
  `);

  // 🚀 INDEXES (this helps performance marks)
  db.run(`CREATE INDEX IF NOT EXISTS idx_gender ON profiles(gender)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_country ON profiles(country_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_age ON profiles(age)`);

  console.log("Database ready 🚀");
});

// 🛡️ graceful error handling
db.on("error", (err) => {
  console.error("Database error:", err.message);
});

module.exports = db;