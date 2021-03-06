const { Answer } = require("../models/Answer.model");
const { Question } = require("../models/Question.model");
// Get List Answer
module.exports.getAnswer = (req, res, next) => {
  return Answer.find()
    .then((answer) => {
      return res.status(200).json(answer);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

// Create the answer
module.exports.createAnswer = (req, res, next) => {
  const { typeAnswer, answerArray, trueAnswer, questionId } = req.body;
  const answer = new Answer({
    typeAnswer, answerArray, trueAnswer
  })
  Question.findById(questionId)
    .then(q => {
      if (!q)
        return Promise.reject({
            status: 404,
            message: "question not found",
        });
        q.answerId = answer;
        return Promise.all([answer.save(), q.save(), res.status(200).json(q)]);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
  
};

// Delete the answer
module.exports.deleteAnswerById = (req, res, next) => {
  const { answerId } = req.params;
  let _answer;
  Answer.findById(answerId)
    .then((answer) => {
      if (!answer)
        return Promise.reject({
          status: 404,
          Message: "Answer Not Found",
        });
      _answer = answer;
      return answer.deleteOne();
    })
    .then(() => res.status(200).json({ message: "Delete Answer Successfully!" }))
    .catch((err) => res.status(500).json(err));
};

// Update the answer
module.exports.updateAnswer = (req, res, next) => {
  const { id } = req.params;
  const { typeAnswer, answerArray, trueAnswer } = req.body;

  Answer.findById(id)
    .then((answer) => {
      if (!answer) {
        return Promise.reject({ status: 404, message: "Answer Not Found!!!" });
      }
      answer.typeAnswer = typeAnswer;
      answer.answerArray = answerArray;
      answer.trueAnswer = trueAnswer;
      return answer.save();
    })
    .then((answer) => res.status(200).json(answer))
    .catch((err) => {
      return res.status(500).json(err);
    });
};
