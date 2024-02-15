const Post = require("../model/post");
const path = require("path");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");


exports.getPosts = async (req, res, next) => {
  try {
    const resData = await Post.find({});
    console.log(resData);

    res.status(200).json({
      message: "You are Fetching Details Successfully",
      post: resData,
      createdAt: new Date(),
      createdBy: "Raj Mandal",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "You have given a Wrong Input!",
      errors: errors.array(),
    });
  }

  if (!req.file) {
    const error = new Error("No Image Provided");
    error.statusCode = 422;
    // console.log("file ERROR ☑");
    // console.log(error);
    throw error;
  }

  try {
    // console.log(req.file?.path);
    console.log(req.file.path);
    const title = req.body.title;
    const describe = req.body.describe;
    const imageUrl = req.file.path.replace("\\", "/");
    const prize = req.body.prize;
    // const createdBy = req.body.createdBy;

    const post = new Post({
      title: title,
      describe: describe,
      imageUrl: imageUrl,
      prize: prize,
    });

    await post.save();

    res.status(201).json({
      message: "Post Created Successfully!",
      createdAT: new Date(),
    });
  } catch (err) {
    next(err);
  }
};
