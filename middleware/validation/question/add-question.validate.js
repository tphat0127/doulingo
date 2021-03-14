const validator = require("validator");
const _ = require("lodash");
const { Question } = require("../../../models/Question.model");

module.exports.validateAddQuestion = async (req, res, next) => {
  const authorId = req.body.authorId;
  const chapterId = req.body.chapterId;
  const contentQuestion = req.body.contentQuestion;
  const typeQuestion = req.body.typeQuestion;
  const image = req.body.image;
  const answerId = req.body.answerId;
  const error = {};

  if (!chapterId) {
    error.topicId = "chapterId is required";
  }
  if (!contentQuestion) {
    error.contentQuestion = "contentQuestion is required";
  }
  // if (!answerId) {
  //   error.answerId = "answerId is required";
  // }
  if (!typeQuestion) {
    error.typeQuestion = "typeQuestion is required";
  }
 
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
  return next();
};
