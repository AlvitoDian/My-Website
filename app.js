require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const moment = require("moment");

let logCalled = false;

//? MongoDB connection setup
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error" + err);
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
}

//? MongoDB connection setup End

//? Model LOG
const logSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  time: String,
});

const Log = mongoose.model("Log", logSchema);
//? Model LOG End

//? Send to MongoDB
const sendToMongoDB = async (ip, userAgent, time) => {
  await connectDB();
  const logEntry = new Log({
    ip,
    userAgent,
    time,
  });
  await logEntry.save();
};
//? Send to MongoDB End

//? Log Express
/* app.use((req, res, next) => {
  if (!logCalled && req.path === "/") {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Time: ${time}, IP: ${ip}, User Agent: ${userAgent}`);

    logCalled = true;
    sendToMongoDB(ip, userAgent, time);
  }
  next();
}); */
//? Log Express End

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  if (!logCalled) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Time: ${time}, IP: ${ip}, User Agent: ${userAgent}`);

    logCalled = true;
    sendToMongoDB(ip, userAgent, time);
  }

  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.use(express.static("public"));

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
