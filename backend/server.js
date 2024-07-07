const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SummarizerUser = require("./SummarizerUserSchema");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.h3qloyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// JWT Secret
const jwtSecret = "jwtSecret";

// CORS proxy endpoint
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching the URL");
  }
});

// Authentication endpoints
// Signup
app.post("/api/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await SummarizerUser.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new SummarizerUser({ username, password });
    await user.save();
    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//sign in
app.post("/api/auth/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await SummarizerUser.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add history route
app.post("/api/history/add", authenticateToken, async (req, res) => {
  const { username, content } = req.body;
  try {
    let user = await SummarizerUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.history.push({ content });
    await user.save();
    res.status(200).json({ msg: "History added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get history route
app.get("/api/history/:username", authenticateToken, async (req, res) => {
  const { username } = req.params;
  try {
    let user = await SummarizerUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user.history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Middleware function to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
