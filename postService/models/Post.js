const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  tag: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true, },
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
