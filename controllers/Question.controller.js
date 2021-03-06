const express = require("express");
const { uploadImages } = require("../middleware/img/index");
const {
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestionById,
  finalResult,
  uploadImage
} = require("../services/Question.service");
const { authenticate, authorization } = require("../middleware/auth/index");
const { validateAddQuestion } = require("../middleware/validation/question/add-question.validate");
const router = express.Router();

router.post(
  "/questions/:id/up",
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  uploadImages("questionImg"),
  uploadImage
);
router.get("/question", getQuestion);
router.post("/question", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddQuestion, createQuestion);
router.put("/question/:id", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddQuestion, updateQuestion);
router.delete("/question/:questionId", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), deleteQuestionById);
router.post("/question/:id", authenticate, finalResult);
module.exports = router;
