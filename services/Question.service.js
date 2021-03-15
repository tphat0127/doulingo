const { model } = require("mongoose");
const { Question } = require("../models/Question.model");
const { UserChapter } = require("../models/ChapterUser.model");
const { Chapter } = require("../models/Chapter.model");
const { User } = require("../models/User.model");

// Get List Questions
module.exports.getQuestion = (req, res, next) => {
  return Question.find()
    .populate("answerId")
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
    answerId,
    level,
    part
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
    answerId,
    level,
    part
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
  const { choose } = req.body;
  const { id } = req.params;
  const question = await Question.findById(id);
  const chapterId = question.chapterId
  const user = await User.findOne({ _id: req.user._id });
  const chapterJoin = user.chapterJoin;
  const userChapter = await UserChapter.findOne({ _id: chapterJoin, chapterId });
  const chapter = await Chapter.findById(chapterId);
  
  console.log(chapter.part)
  Question.findById(id)
    .populate("answerId")
    .then(q => {
      const result = q.answerId.trueAnswer == choose;
      if (result) {
        if (userChapter.part < chapter.maxPart) userChapter.part += 1;
        if (userChapter.part === chapter.maxPart) userChapter.level += 1;
      }
      return Promise.all([res.status(200).json({
        message: "Successfully", result: result, yourAnswer: choose, trueAnswer: q.answerId.trueAnswer
      }), userChapter.save()])
    })
    .catch(err => {
      res.status(500).json(err);
    })
}