// controllers/comment.controller.js
const db = require("../models");

exports.createComment = (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const content = req.body.content;

  // Проверяем, существует ли пользователь и пост
  db.User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      db.Post.findByPk(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).send({ message: "Post Not found." });
          }

          // Создаем комментарий
          db.Comment.create({
            UserId: userId,
            PostId: postId,
            content: content,
          })
            .then((comment) => {
              res.json(comment);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ message: "Failed to create comment" });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to find post" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to find user" });
    });
};

exports.getAllComments = (req, res) => {
  const postId = req.params.postId;

  // Находим все комментарии для данного поста
  db.Comment.findAll({
    where: {
      PostId: postId,
    },
  })
    .then((comments) => {
      res.json(comments);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to get comments" });
    });
};

exports.deleteComment = (req, res) => {
  const commentId = req.params.id;

  // Удаляем комментарий по его идентификатору
  db.Comment.destroy({ where: { id: commentId } })
    .then(() => {
      res.json({ message: "Comment deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to delete comment" });
    });
};
