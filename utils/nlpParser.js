const countryMap = {
  nigeria: "NG",
  kenya: "KE",
  angola: "AO",
  tanzania: "TZ",
  ghana: "GH",
  uganda: "UG",
};

function parseQuery(query) {
  if (!query || typeof query !== "string") return {};

  query = query.toLowerCase().trim();

  let filters = {};

  // =========================
  // 👤 GENDER (avoid conflict)
  // =========================
  const hasMale = query.includes("male") || query.includes("males");
  const hasFemale = query.includes("female") || query.includes("females");

  if (hasMale && !hasFemale) {
    filters.gender = "male";
  } else if (hasFemale && !hasMale) {
    filters.gender = "female";
  }

  // =========================
  // 📊 AGE GROUP
  // =========================
  if (query.includes("child")) filters.age_group = "child";
  if (query.includes("teen")) filters.age_group = "teenager";
  if (query.includes("adult")) filters.age_group = "adult";
  if (query.includes("senior")) filters.age_group = "senior";

  // =========================
  // 🧠 SPECIAL RULE: YOUNG
  // =========================
  // REQUIRED BY SPEC: 16–24
  if (query.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  // =========================
  // 🔢 AGE CONDITIONS
  // =========================

  // above X
  const aboveMatch = query.match(/above\s+(\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]);
  }

  // below X
  const belowMatch = query.match(/below\s+(\d+)/);
  if (belowMatch) {
    filters.max_age = parseInt(belowMatch[1]);
  }

  // =========================
  // 🌍 COUNTRY MAPPING
  // =========================
  let countryFound = false;

  for (const country in countryMap) {
    if (query.includes(country)) {
      filters.country_id = countryMap[country];
      countryFound = true;
      break;
    }
  }

  // =========================
  // 🧠 VALIDATION RULE
  // =========================
  // If query has NO meaning → return empty (handled by server as error)
  const hasMeaning =
    filters.gender ||
    filters.age_group ||
    filters.min_age ||
    filters.max_age ||
    filters.country_id;

  if (!hasMeaning) return {};

  return filters;
}

module.exports = { parseQuery };