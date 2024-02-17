require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const feedRoute = require("./routes/feed");
const mongoose = require("mongoose");

// add core policy after bodyparser

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});
app.use(bodyParser.json());

// tomorrow Learn authentication

app.use("/feed", feedRoute);

app.use("/", (req, res, next) => {
  res.write("<h2> TESTING API </h2>");
  res.end();
});

mongoose
  .connect(process.env.DATA_BASE_URL)
  .then((res) => {
    // console.log(res);
    console.log("Database Connection Successful!");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`SERVER is RUNNING on PORT=${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
