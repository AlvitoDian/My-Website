require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const mongodb = require("mongodb");

let logRecorded = false;

//? MongoDB connection setup
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();
//? MongoDB connection setup End

//? Model LOG
const logSchema = new mongoose.Schema({
  message: String,
  timestamp: Date,
});

const Log = mongoose.model("Log", logSchema);
//? Model LOG End

//? Morgan Logging
const sendToMongoDB = async (message) => {
  const logEntry = new Log({
    message,
    timestamp: new Date(),
  });
  await logEntry.save();
};

morgan.token("ip", (req) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  return ip;
});

morgan.token("software", (req) => req.get("User-Agent") || "Unknown");

morgan.format(
  "custom",
  ":ip :method :url :status :res[content-length] - :response-time ms - Software: :software"
);

//? Morgan Logging End

//? Morgan Middleware
const logFirstRequest = (req, res, next) => {
  if (!logRecorded && req.method === "GET" && req.path === "/") {
    morgan("custom", {
      stream: {
        write: (message) => {
          sendToMongoDB(message);
          console.log(message);
          logRecorded = true;
        },
      },
    })(req, res, next);
  } else {
    next();
  }
};

app.use(logFirstRequest);
//? Morgan Middleware End

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

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
    from: `${email}`,
    to: process.env.EMAIL,
    subject: "Dari Pengunjung Web-mu... ^^",
    text: `Halo Alvito, \n\n${message} \n\nDari ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send("Success");
  });
});
