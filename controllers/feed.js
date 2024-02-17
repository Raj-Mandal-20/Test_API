const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    message: "You are Fetching Details Successfully",
    post: [
      {
        title: "Biriyani",
        describe: "Bengali's Best Food",
        prize: 300,
      },
    ],
    createdAt: new Date(),
    createdBy: "Raj Mandal",
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "You have given a Wrong Input!",
      errors: errors.array(),
    });
  }

  const title = req.body.title;
  const describe = req.body.describe;
  const prize = req.body.prize;
  const createdBy = req.body.createdBy;

  res.status(201).json({
    message: "Post Created Successfully!",
    post: [
      {
        title: title,
        describe: describe,
        prize: prize,
      },
    ],
    createdAT: new Date(),
    createdBy: createdBy,
  });
};
