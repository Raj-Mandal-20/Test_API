require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const feedRoute = require("./routes/feed");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const app = express();
const authRoute = require("./routes/auth");
const User = require("./model/user");

/* Additional Setup while using VPN to access database */

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

app.use("/auth", authRoute);

// carry the userId after this middleware
app.use(async (req, res, next) => {
  try {
    const user = await User.find(req.userId);
    if (!user) {
      throw new Error("User Not Found!");
    }
  } catch (err) {
    throw err;
  }

  next();
});

app.use("/feed", feedRoute);

app.use("/", (req, res, next) => {
  res.write("<h2> TESTING API </h2>");
  res.end();
});

// Advance Error Handling

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const data = error.data;
  const message = error.message;

  res.status(status).json({
    data: data,
    message: message,
  });
});

mongoose
  .connect(process.env.DATA_BASE_URL)
  .then(async (res) => {
    // console.log(res);
    console.log("Database Connection Successful!");

    app.listen(process.env.PORT || 3000, () => {
      console.log(`SERVER is RUNNING on PORT=${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
