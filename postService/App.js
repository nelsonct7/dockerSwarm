const express = require("express");
const { connectToDb } = require("./db");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
var cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3002;

const postRoutes = require("./routes/posts");
const authMiddleware = require("./Auth/authService");

app.use(cors("*"));
app.use(morgan("combined"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api", authMiddleware, postRoutes);
app.get("/", (req, res) => {
  return res.status(200).json({ message: `Current time ${new Date.now()}` });
});

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// db connection call back
const dbCb = (dbUrl) =>
  console.log("[!] Connection established from post server to db at", dbUrl);

// connect to db
connectToDb(dbCb)
  .then((data) => {
    app.listen(port, () => {
      console.log(`Post app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("[!] Post server failed", error);
  });
