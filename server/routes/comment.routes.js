module.exports = (app) => {
  var router = require("express").Router();
  const Comment = require("../controllers/comment.controller");

  router.post("/", Comment.createComment);
  router.get("/:postId", Comment.getAllComments);
  router.delete("/:id", Comment.deleteComment);

  app.use("/api/comment", router);

};
