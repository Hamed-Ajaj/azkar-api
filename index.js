const express = require("express");
const cors = require("cors");
const azkar = require("./azkar.json");

const app = express();
app.use(cors()); // Enable CORS for public access

const PORT = process.env.PORT || 3000;

// Route to get all Azkar
app.get("/api/azkar", (req, res) => {
  res.json(azkar);
});

// Route to get a random Zekr
app.get("/api/azkar/random", (req, res) => {
  const randomZekr = azkar[Math.floor(Math.random() * azkar.length)];
  res.json(randomZekr);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
