const mongoose = require("mongoose");

const SummarizerUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  history: [
    {
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const SummarizerUser = mongoose.model("SummarizerUser", SummarizerUserSchema);

module.exports = SummarizerUser;
