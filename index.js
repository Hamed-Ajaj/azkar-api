const express = require("express");
const cors = require("cors");
const azkar = require("./azkar.json");

const app = express();
app.use(cors()); // Enable CORS for public access

const PORT = process.env.PORT || 3000;

// Route to get all Azkar
app.get("/", (req, res) => {
  res.json(azkar);
});
// Route to get Morning Azkar

app.get("/morning", (req, res) => {
  const morningAzkar = azkar["أذكار الصباح"];
  res.json(morningAzkar);
});

// Route to get Evening Azkar
app.get("/evening", (req, res) => {
  const eveningAzkar = azkar["أذكار المساء"];
  res.json(eveningAzkar);
});

// Route to get sleep Azkar
app.get("/sleep", (req, res) => {
  const sleepAzkar = azkar["أذكار النوم"];
  res.json(sleepAzkar);
});

// Route to get wakeup Azkar
app.get("/wakeup", (req, res) => {
  const wakeupAzkar = azkar["أذكار الاستيقاظ"];
  res.json(wakeupAzkar);
});

// Route to get after salah Azkar
app.get("/after-salah", (req, res) => {
  const afterSalahAzkar = azkar["أذكار بعد السلام من الصلاة المفروضة"];
  res.json(afterSalahAzkar);
});

// Route to get anbiya duaa
app.get("/anbiya-duaa", (req, res) => {
  const anbiyaDuaa = azkar["أدعية الأنبياء"];
  res.json(anbiyaDuaa);
});

// Route to get quran duaa
app.get("/quran-duaa", (req, res) => {
  const quranDuaa = azkar["أدعية قرآنية"];
  res.json(quranDuaa);
});

// Route to get tasabeeh
app.get("/tasabeeh", (req, res) => {
  const tasabeeh = azkar.تسابيح;
  res.json(tasabeeh);
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
