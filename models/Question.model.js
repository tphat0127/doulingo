const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  contentQuestion: { type: String, required: true },
  typeQuestion: { type: String, required: true },
  createdDate: { type: Date, required: true, default: Date.now() },
  status: { type: Boolean, required: true, default: true },
  image: { type: String, required: true },
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: false},
  level: { type: Number, required: true, default: 0 },
  part: { type: Number, required: true, default: 0 },
});

const Question = mongoose.model("Question", QuestionSchema, "Question");
module.exports = {
  QuestionSchema,
  Question,
};
