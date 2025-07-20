require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
  const ip = req.ip;
  const userAgent = req.get("User-Agent");
  const time = new Date().toISOString();

  try {
    await pool.query(
      "INSERT INTO t_logs (usrip, usrag, date) VALUES ($1, $2, $3)",
      [ip, userAgent, time]
    );
  } catch (err) {
    console.error("Gagal menyimpan log:", err);
  }

  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Kirim email
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_APP,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: "Dari Pengunjung Web-mu... ^^",
    text: `Halo Alvito,\n\n${message}\n\nDari ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error.toString());
    res.send("Success");
  });
});

// Get leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, score, date FROM t_results ORDER BY score DESC"
    );
    if (result.rows.length === 0)
      return res.status(200).send("Leaderboard kosong.");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error ambil leaderboard:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil leaderboard.");
  }
});

// Submit result
app.post("/result", async (req, res) => {
  const { name, score, date } = req.body;

  if (!name || !score || !date) {
    return res.status(400).send("Semua field (name, score, date) harus ada.");
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM t_results WHERE name = $1",
      [name]
    );

    if (existing.rows.length > 0) {
      const oldScore = existing.rows[0].score;
      if (score > oldScore) {
        await pool.query(
          "UPDATE t_results SET score = $1, date = $2 WHERE name = $3",
          [score, date, name]
        );
        return res.status(200).send("Skor berhasil diperbarui.");
      } else {
        return res
          .status(200)
          .send("Skor lama lebih tinggi atau sama, tidak ada perubahan.");
      }
    } else {
      await pool.query(
        "INSERT INTO t_results (name, score, date) VALUES ($1, $2, $3)",
        [name, score, date]
      );
      return res.status(200).send("Data hasil game berhasil disimpan.");
    }
  } catch (error) {
    console.error("Error simpan result:", error);
    res.status(500).send("Terjadi kesalahan saat menyimpan data.");
  }
});
