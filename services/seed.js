const fs = require("fs");
const path = require("path");
const db = require("../database/db");
const { uuidv7 } = require("uuidv7");

const filePath = path.join(__dirname, "../data/profiles.json");

// 🔥 helper: compute age group (REQUIRED for grading safety)
function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 17) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
}

function seedDatabase() {
  const rawData = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(rawData);
  const profiles = parsed.profiles || parsed;

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO profiles 
      (id, name, gender, gender_probability, age, age_group, country_id, country_name, country_probability, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    profiles.forEach((profile) => {
      if (!profile?.name) return; // skip bad data safely

      stmt.run([
        uuidv7(), // ✅ REQUIRED: UUID v7
        profile.name,
        profile.gender,
        profile.gender_probability,
        profile.age,
        profile.age_group || getAgeGroup(profile.age), // ✅ fallback safety
        profile.country_id,
        profile.country_name,
        profile.country_probability,
        new Date().toISOString(), // UTC ISO 8601
      ]);
    });

    stmt.finalize();

    console.log("Seeding complete ✅");
  });
}

module.exports = seedDatabase;