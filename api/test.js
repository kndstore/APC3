const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

// ⚠️ PAS de app.listen

module.exports = app;