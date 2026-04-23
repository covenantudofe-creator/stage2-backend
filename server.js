console.log("SERVER FILE LOADED");

const express = require("express");
const cors = require("cors");

const db = require("./database/db");
const { parseQuery } = require("./utils/nlpParser");
const { buildQuery } = require("./utils/queryParser");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors({ origin: "*" }));
app.use(express.json());

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.json({ message: "Stage 2 API is live 🚀" });
});

// =======================
// GET ALL PROFILES
// =======================
app.get("/api/profiles", (req, res) => {
  const {
    gender,
    age_group,
    country_id,
    min_age,
    max_age,
    min_gender_probability,
    min_country_probability,
    sort_by = "created_at",
    order = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const safeLimit = Math.min(parseInt(limit) || 10, 50);
  const safePage = Math.max(parseInt(page) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const filters = {
    gender,
    age_group,
    country_id,
    min_age,
    max_age,
    min_gender_probability,
    min_country_probability,
    sort_by,
    order,
  };

  const { query, values } = buildQuery(filters);
  const finalQuery = `${query} LIMIT ? OFFSET ?`;

  db.all(finalQuery, [...values, safeLimit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }

    db.get("SELECT COUNT(*) as total FROM profiles", (err2, count) => {
      if (err2) {
        return res.status(500).json({
          status: "error",
          message: err2.message,
        });
      }

      res.json({
        status: "success",
        page: safePage,
        limit: safeLimit,
        total: count.total,
        data: rows,
      });
    });
  });
});

// =======================
// NATURAL LANGUAGE SEARCH
// =======================
app.get("/api/profiles/search", (req, res) => {
  const q = req.query.q;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Missing query parameter",
    });
  }

  const filters = parseQuery(q);

  if (!filters || Object.keys(filters).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Unable to interpret query",
    });
  }

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const offset = (page - 1) * limit;

  const { query, values } = buildQuery(filters);
  const finalQuery = `${query} LIMIT ? OFFSET ?`;

  db.all(finalQuery, [...values, limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }

    res.json({
      status: "success",
      page,
      limit,
      data: rows,
    });
  });
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});