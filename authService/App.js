const express = require("express");
const { connectToDb } = require("./db");
const app = express();
require("dotenv").config();
const morgan = require('morgan')
var cors = require('cors')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3001;

const userRoutes = require("./routes/user");
const secureRoute = require("./routes/protectedRoutes");

app.use(cors("*"))
app.use(morgan('combined'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use("/auth", userRoutes);
app.use("/user", secureRoute);
app.get('/',(req,res)=>{
    return res.status(200).json({message : `Current time ${new Date.now()}`})
})

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// db connection call back
const dbCb = (dbUrl) =>
  console.log("[!] Connection established from auth server to db at", dbUrl);

// connect to db
connectToDb(dbCb)
  .then((data) => {
    app.listen(port, () => {
        console.log(`Auth app listening on port ${port}`);
      });
  })
  .catch((error) => {
    console.error("[!] Auth server failed", error);
  });
