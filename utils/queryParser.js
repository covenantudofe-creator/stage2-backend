function buildQuery(params) {
  let query = "SELECT * FROM profiles WHERE 1=1";
  let values = [];

  // =========================
  // 👤 GENDER FILTER
  // =========================
  if (params.gender) {
    query += " AND LOWER(gender) = LOWER(?)";
    values.push(params.gender);
  }

  // =========================
  // 🌍 COUNTRY FILTER
  // =========================
  if (params.country_id) {
    query += " AND LOWER(country_id) = LOWER(?)";
    values.push(params.country_id);
  }

  // =========================
  // 👥 AGE GROUP
  // =========================
  if (params.age_group) {
    query += " AND LOWER(age_group) = LOWER(?)";
    values.push(params.age_group);
  }

  // =========================
  // 🔢 AGE RANGE
  // =========================
  if (params.min_age !== undefined) {
    query += " AND age >= ?";
    values.push(Number(params.min_age));
  }

  if (params.max_age !== undefined) {
    query += " AND age <= ?";
    values.push(Number(params.max_age));
  }

  // =========================
  // 📊 PROBABILITY FILTERS
  // =========================
  if (params.min_gender_probability !== undefined) {
    query += " AND gender_probability >= ?";
    values.push(Number(params.min_gender_probability));
  }

  if (params.min_country_probability !== undefined) {
    query += " AND country_probability >= ?";
    values.push(Number(params.min_country_probability));
  }

  // =========================
  // ↕️ SORTING (SAFE WHITELIST)
  // =========================
  const allowedSortFields = ["age", "created_at", "gender_probability"];

  const sortBy = allowedSortFields.includes(params.sort_by)
    ? params.sort_by
    : "created_at";

  const order =
    params.order && params.order.toLowerCase() === "asc"
      ? "ASC"
      : "DESC";

  query += ` ORDER BY ${sortBy} ${order}`;

  return { query, values };
}

module.exports = { buildQuery };