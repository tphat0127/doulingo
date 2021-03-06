const mongoose = require("mongoose");

const TopicSchema = mongoose.Schema({
  contentTopic: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
  image: { type: String, required: true },
  chapterList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter", }]
});

const Topic = mongoose.model("Topic", TopicSchema, "Topic");
module.exports = {
  TopicSchema,
  Topic,
};
