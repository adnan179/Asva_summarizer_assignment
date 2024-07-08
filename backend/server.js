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
mongoose.connect("Paste your mongoDB url");
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
        username: user.username,
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: 2400 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add history
app.post("/api/history/add/:username", async (req, res) => {
  const { username } = req.params;
  const { historyContent } = req.body;

  try {
    const user = await SummarizerUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.history.push({ historyContent: historyContent });
    await user.save();

    res.status(200).json({ msg: "History added successfully" });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Get history
app.get("/api/history/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await SummarizerUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
      console.log(username);
    }

    res.status(200).json(user.history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
