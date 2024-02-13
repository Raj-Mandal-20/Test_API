require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const feedRoute = require("./routes/feed");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else cb(null, false);
};

app.use(bodyParser.json());
app.use(
  multer({ storage: storage, fileFilter: fileFilter }).single("imageUrl")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// add core policy after bodyparser
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});



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
