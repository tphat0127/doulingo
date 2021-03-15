const mongoose = require("mongoose");

const AnswerSchema = mongoose.Schema({
  typeAnswer: { type: String, required: true },//sap xep, chon dap dung, nghe, lib: stx
  answerArray: { type: Array, required: false }, //4 dap an/ ["I","love","you"]
  trueAnswer: { type: String, required: true },// dap an dung
});

const Answer = mongoose.model("Answer", AnswerSchema, "Answer");
module.exports = {
  AnswerSchema,
  Answer,
};