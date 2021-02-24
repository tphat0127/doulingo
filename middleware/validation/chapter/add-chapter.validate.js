const validator = require("validator");
const _ = require("lodash");
const { Chapter } = require("../../../models/Chapter.model");

module.exports.validateAddChapter = async (req, res, next) => {
  const title = req.body.title;
  const topicId = req.body.topicId;
  const level = req.body.topicId;
  const maxLevel = req.body.maxLevel;
  const part = req.body.part;
  const maxPart = req.body.maxPart;
  const opened = req.body.opened;
  const error = {};

  if (!title) {
    error.title = "title is required";
  }
  if (!topicId) {
    error.topicId = "topicId is required";
  }
  if (!level) {
    error.level = "level is required";
  }
  if (!maxLevel) {
    error.maxLevel = "maxLevel is required";
  }
  if (!part) {
    error.part = "part is required";
  }
  if (!maxPart) {
    error.maxPart = "maxPart is required";
  }
  if (!opened) {
    error.opened = "opened is required";
  }
 
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
  return next();
};
