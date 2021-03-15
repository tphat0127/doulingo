const { Chapter } = require("../models/Chapter.model");
const { Topic } = require("../models/Topic.model");
const { Question } = require("../models/Question.model");
const { User } = require("../models/User.model");
const { UserChapter } = require("../models/ChapterUser.model");
const mongoose = require('mongoose');

// Get List Chapter
module.exports.getChapter = (req, res, next) => {
  return Chapter.find()
    .populate("questionList")
    .then((c) => {
      return res.status(200).json(c);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

// Create the Chapter
module.exports.createChapter = (req, res, next) => {
  const { title, level, maxLevel, part, maxPart, opened, topicId } = req.body;
  const author =  req.user._id;
  
  const newChapter = new Chapter({
    author, title, level, maxLevel, part, maxPart, opened, topicId
  })
  Topic.findById(topicId)
    .then(t => {
        if (!t)
        return Promise.reject({
            status: 404,
            message: "topic not found",
        });
        t.chapterList.push(newChapter);
        return Promise.all([newChapter.save(), t.save()]);
    })
    .then((result) => res.status(200).json(result[0]))
    .catch((err) => res.status(500).json(err));
}
// Delete the Chapter
module.exports.deleteChapterById = async (req, res, next) => {
  const { chapterId } = req.params;
  let _chapter;
  const chapter = await Chapter.findById(chapterId)
    .then((c) => {
      if (!c)
        return Promise.reject({
          status: 404,
          Message: "Topic Not Found",
        });
        _chapter = c;
      return c.deleteOne();
    })
    .then(() => res.status(200).json({ message: "Delete Topic Successfully!" }))
    .catch((err) => res.status(500).json(err));

  Topic.updateOne({_id: chapter._id}, 
    {$pull: {"chapterList": chapterId}})
  
};

// Update the Chapter
module.exports.updateChapter = (req, res, next) => {
  const { chapterId } = req.params;
  const { title, level, maxLevel, part, maxPart, opened } = req.body;

  Chapter.findById(chapterId)
    .then((c) => {
      if (!c) {
        return Promise.reject({ status: 404, message: "Chapter Not Found!!!" });
      }
      c.title = title;
      c.level = level;
      c.maxLevel = maxLevel;
      c.part = part;
      c.maxPart = maxPart;
      c.opened = opened;
      return c.save();
    })
    .then((c) => {
      res.status(200).json(c);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
//  Topic.findById(topicId)
//     .then(t => {
//         t.updateOne({ $pull: {chapterList: topicId}});
//         t.chapterList.push(c)
//     })
//     .then
};
module.exports.StartChapter = async (req, res, next) => {
  const { level, part} = req.body;
  // const uc = await UserChapter.findOne({"chapterId": req.params.chapterId});
  // const user = await User.findOne(req.user._id);
  // if(uc) return res.status(500).json({ message: "Chapter already exists." });
  
  const newUC = new UserChapter({
    chapterId: req.params.chapterId,
    level,
    part
  });
  newUC.save();
  User.findById(req.user._id)
    .then(u => {
      u.chapterJoin.push(newUC);
      u.save();
      res.status(200).json(u)
    })
    .catch(err => { res.status(400).json(err)});
};
module.exports.RenderQuestion = async (req, res, next) => {
  const chapterId = req.params.chapterId;
  try {
    const user = await User.findOne(
      {_id: req.user._id}
    ).populate("chapterJoin");
    if (!user) return res.status(404).json({ message: "User not found" });
    const uc = user.chapterJoin.find(x => x.chapterId == chapterId);
    const questionList = await Question.find({chapterId, "level": uc.level, "part": uc.part}).populate("answerId")
    if (!questionList) return res.status(404).json({ message: "questionList not found" });
    return res.status(200).json(questionList);
  } catch (e) {
    res.status(500).send(e);
  }
}