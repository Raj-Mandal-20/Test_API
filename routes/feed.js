const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const isAuth = require('../middleware/is_auth');
const feedController = require("../controllers/feed");

router.get("/posts", isAuth , feedController.getPosts);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({
      min: 5,
    }),
    body("describe").trim().isLength({
      min: 5,
    }),
  ],
  feedController.createPost
);
module.exports = router;
