module.exports = (app) => {
  var router = require("express").Router();
  const Comment = require("../controllers/comment.controller");

  router.post("/", Comment.createComment);
  
  router.get("/", Comment.findAllCommentsForPosts);
  
  router.get("/:id", Comment.findAllCommentsForPost);

  router.delete("/:id", Comment.deleteComment);

  app.use("/api/comments", router);

};
