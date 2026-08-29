const express = require("express");
const cors = require("cors");
const azkar = require("./azkar.json");

const app = express();

// CORS: restrict to the frontend origin via env var. Falls back to open for
// local development until CORS_ORIGIN is set in Vercel.
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

// Static JSON content -> cache it at the edge for an hour.
app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  next();
});

// Map URL slugs (used by the frontend) to the Arabic keys in azkar.json.
const categoryKeys = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  sleep: "أذكار النوم",
  wakeup: "أذكار الاستيقاظ",
  "after-salah": "أذكار بعد السلام من الصلاة المفروضة",
  "anbiya-duaa": "أدعية الأنبياء",
  "quran-duaa": "أدعية قرآنية",
  tasabeeh: "تسابيح",
};

const getCategory = (key) => (Object.hasOwn(azkar, key) ? azkar[key] : null);

// Health check (useful for verifying the Vercel deployment).
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// All categories.
app.get("/", (req, res) => {
  res.json(azkar);
});

// Random zikr. azkar.json is an object keyed by category, so flatten the
// values into a single array before picking a random item.
app.get("/api/azkar/random", (req, res) => {
  const allItems = Object.values(azkar).flat();
  if (allItems.length === 0) {
    return res.status(404).json({ error: "No azkar available" });
  }

  const randomZikr = allItems[Math.floor(Math.random() * allItems.length)];
  res.json(randomZikr);
});

// Dynamic category route: /api/azkar/:category (e.g. /api/azkar/morning).
app.get("/api/azkar/:category", (req, res) => {
  const key = categoryKeys[req.params.category];
  const items = key ? getCategory(key) : null;

  if (!items) {
    return res
      .status(404)
      .json({ error: `Unknown category: ${req.params.category}` });
  }

  res.json(items);
});

// Root-level category routes kept for compatibility with the current
// frontend, which calls `https://<api>/<category>` directly.
Object.entries(categoryKeys).forEach(([slug, key]) => {
  app.get(`/${slug}`, (req, res) => {
    const items = getCategory(key);
    if (!items) {
      return res.status(404).json({ error: `Unknown category: ${slug}` });
    }
    res.json(items);
  });
});

// 404 handler for any unmatched route.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (Express recognizes it by the 4-argument signature).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Vercel captures this server via the listen() call; PORT is only used when
// running locally with `npm start`.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
