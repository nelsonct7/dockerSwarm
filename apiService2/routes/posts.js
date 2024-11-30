const app = require("express");
const PostModel = require("../models/Post");
const router = app.Router();

router.get("/post/all", async (req, res) => {
  try {
    const posts = await PostModel.find();
    return res
      .status(200)
      .json({ message: "All posts retrieved", posts: posts });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get all posts" });
  }
});
router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId)
      return res.status(400).json({ message: "Post id is required" });
    const post = await PostModel.findOne({ _id: postId });
    if (!post)
      return res.status(404).json({ message: "Requested post not found" });
    return res
      .status(200)
      .json({ message: "Post retrieved success fully", post: post });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get post" });
  }
});
router.post("/post", async (req, res) => {
  try {
    const { tag, title, description } = req.body;
    if (!tag || !title || !description)
      return res.status(400).json({
        message: "Please provide necessary information to create a post",
      });
    const existingPost = await PostModel.findOne({ title: title });
    if (existingPost)
      return res
        .status(409)
        .json({ message: "Post title is conflicting, please change" });

    const newPost = new PostModel({ title, tag, description });
    await newPost.save();
    return res.status(201).json({ message: "Post created success fully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post" });
  }
});
router.put("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId)
      return res.status(400).json({ message: "Post id is required" });
    const { tag, title, description } = req.body;
    const post = await PostModel.findOne({ _id: postId });
    if (!post)
      return res.status(404).json({ message: "Requested post not found" });
    if (tag) post.tag = tag;
    if (title) post.title = title;
    if (description) post.description = description;

    await post.save();
    return res.status(200).json({ message: "Updated the post success fully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post" });
  }
});
router.delete("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId)
      return res.status(400).json({ message: "Post id is required" });

    await PostModel.deleteOne({ _id: postId });
    return res.status(204).json({message:'Deleted post success fully'});
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
