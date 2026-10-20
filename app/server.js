const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT || 3000);

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://demo:demo@localhost:5432/notes",
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/notes", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, body, created_at FROM notes ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notes", async (req, res) => {
  const title = String(req.body?.title || "").trim();
  const body = String(req.body?.body || "").trim();

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING id, title, body, created_at",
      [title, body]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`notes app listening on ${port}`);
});
