module.exports = (app) => {
    var router = require("express").Router();
  const CommentController = require("../controllers/comment");

  router.post("/", CommentController.createComment);
  router.get('/:postId', CommentController.getAllComments);
  router.delete("/:id", CommentController.deleteComment);

  app.use("/api/comment");
};
