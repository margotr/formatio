const express = require("express");
const app = express();
var path = require("path");
const port = 3000;

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/landing", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/landing.html"));
});

app.listen(port, () => {
  console.log(`Formatio listening at http://localhost:${port}`);
});
