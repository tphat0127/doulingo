const express = require("express");
const {
    createChapter,
    getChapter,
    deleteChapterById,
    updateChapter,
    StartChapter,
    RenderQuestion
} = require("../services/Chapter.service");
const { authenticate, authorization } = require("../middleware/auth/index");
const { validateAddChapter } = require("../middleware/validation/chapter/add-chapter.validate");
const router = express.Router();

router.get("/chapter", getChapter);
router.post("/chapter", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddChapter, createChapter);
router.delete("/chapter/:chapterId", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), deleteChapterById);
router.put("/chapter/:chapterId", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddChapter, updateChapter);
router.post("/chapter/:chapterId/start", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), StartChapter);
router.get("/chapter/:chapterId/question", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), RenderQuestion);
module.exports = router;
