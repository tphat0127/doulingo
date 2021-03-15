const mongoose = require("mongoose");

const ChapterSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createDate: {type: String, required: true, default: Date.now()},
  level: { type: Number, required: true, default: 0},
  maxLevel: { type: Number, required: true, default: 5 },
  part: { type: Number, required: true, default: 0 },
  maxPart: { type: Number, required: true, default: 5 },
  opened: { type: Boolean, required: true, default: false },
  questionList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

const Chapter = mongoose.model("Chapter", ChapterSchema, "Chapter");
module.exports = {
  ChapterSchema,
  Chapter,
};