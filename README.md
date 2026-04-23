📦 Stage 2 Backend — Intelligence Query Engine
🚀 Overview

This project is a backend API built for Insighta Labs to power demographic intelligence queries. It enables clients to filter, sort, paginate, and search a large dataset of user profiles using both structured queries and natural language input.

The system is designed to simulate real-world data querying needs for marketing, analytics, and growth teams.

⚙️ What This Project Does

This is a backend API that allows users to:

Get profile data
Filter results
Sort results
Paginate data
Search using natural language

📡 Main Endpoints
1. Get Profiles
GET /api/profiles

Example:
/api/profiles?gender=male&country_id=NG&min_age=25

2. Search (Natural Language)
GET /api/profiles/search?q=
Example:
/api/profiles/search?q=young males from nigeria

🧠 NLP Parsing (How Search Works)

The system converts simple English into filters:

Input	Meaning
young	age 16–24
male	gender = male
female	gender = female
nigeria	country_id = NG
kenya	country_id = KE
adult	age_group = adult
teenager	age_group = teenager

📄 Example Queries
/api/profiles/search?q=females above 30 from kenya
/api/profiles/search?q=young males from nigeria
/api/profiles/search?q=adult males from uganda

🗄️ Database

Each profile contains:

id
name
gender
age
age_group
country_id
country_name
probabilities
created_at

🌱 Seeding

To seed database:

node services/seed.js


⚠️ Limitations
Uses simple rule-based NLP (no AI)
Only supports predefined countries
Does not handle complex sentences
“young” always means 16–24

🚀 How to Run
npm install
npm start

🏁 Done

This project demonstrates:

REST API design
Filtering & sorting
Pagination
Rule-based NLP parsing
SQLite database usage
Deployment on Railway

