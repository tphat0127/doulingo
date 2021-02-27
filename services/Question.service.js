const { model } = require("mongoose");
const { Question } = require("../models/Question.model");
const { Answer } = require("../models/Answer.model");
const { Chapter } = require("../models/Chapter.model");
const { User } = require("../models/User.model");

// Get List Questions
module.exports.getQuestion = (req, res, next) => {
  return Question.find()
    .then((question) => {
      return res.status(200).json(question);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

// Create the question
module.exports.createQuestion = (req, res, next) => {
  const {
    chapterId,
    contentQuestion,
    typeQuestion,
    createdDate,
    status,
    image,
    questionId,
  } = req.body;
  const authorId = req.user._id;

  const newQuestion = new Question({
    authorId,
    chapterId,
    contentQuestion,
    typeQuestion,
    createdDate,
    status,
    image,
    questionId,
  });
  Chapter.findById(chapterId)
    .then(c => {
      if (!c)
        return Promise.reject({
          status: 404,
          message: "chapterId not found",
        });
      c.questionList.push(newQuestion);
      return Promise.all([newQuestion.save(), c.save()]);
    })
    .then((result) => res.status(200).json(result[0]))
    .catch((err) => res.status(500).json(err));
}


// Delete the question =>>>> chua fix
module.exports.deleteQuestionById = (req, res, next) => {
  const { questionId } = req.params;
  let _question;
  Question.findById(questionId)
    .then((question) => {
      if (!question)
        return Promise.reject({
          status: 404,
          Message: "Question Not Found",
        });
      _question = question;
      return question.deleteOne();
    })
    .then(() => res.status(200).json({ message: "Delete Question Successfully!" }))
    .catch((err) => res.status(500).json(err));
};

// Update the question
module.exports.updateQuestion = (req, res, next) => {
  const { id } = req.params;
  const {
    authorId,
    topicId,
    contentQuestion,
    typeQuestion,
    createdDate,
    status,
    image,
    answerId,
  } = req.body;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return Promise.reject({ status: 404, message: "Question Not Found!!!" });
      }
      question.authorId = authorId;
      question.topicId = topicId;
      question.contentQuestion = contentQuestion;
      question.typeQuestion = typeQuestion;
      question.createdDate = createdDate;
      question.status = status;
      question.image = image;
      question.answerId = answerId;
      return question.save();
    })
    .then((question) => res.status(200).json(question))
    .catch((err) => {
      return res.status(500).json(err);
    });
};
//result
module.exports.finalResult = async (req, res, next) => {
  const {choose} = req.body;
  const {id} = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "question not found" });
    
    const answer = await Answer.findById(question.answerId);
    if (!answer) return res.status(404).json({ message: "answer not found" });

    //console.log(answer.trueAnswer, choose)
    const result = await answer.trueAnswer === choose;
    if(result) {
      User.findById(req.user._id)
        .then(u =>{ u.level += 1; u.save()} )
        .catch(err => console.log(err))
    }
    
    return res
      .status(200)
      .json({ message: "Successfully", result: result, trueAnswer: answer.trueAnswer });
  } catch(e) {
    res.status(500).json(e);
  }
}