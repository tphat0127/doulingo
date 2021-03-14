const mongoose = require("mongoose");

const ChapterUserSchema = mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  level: { type: Number, default: 0 },
  part: { type: Number, default: 0 }
});

const UserChapter = mongoose.model("UserChapter", ChapterUserSchema, "UserChapter");
module.exports = {
    ChapterUserSchema,
    UserChapter,
};
