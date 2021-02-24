const express = require("express");
const {
    createChapter,
    getChapter,
    deleteChapterById,
    updateChapter
} = require("../services/Chapter.service");
const { authenticate, authorization } = require("../middleware/auth/index");
const { validateAddChapter } = require("../middleware/validation/chapter/add-chapter.validate");
const router = express.Router();

router.get("/chapter", getChapter);
router.post("/chapter", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddChapter, createChapter);
router.delete("/chapter/:chapterId", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), deleteChapterById);
router.put("/chapter/:chapterId", authenticate, authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]), validateAddChapter, updateChapter);
module.exports = router;
