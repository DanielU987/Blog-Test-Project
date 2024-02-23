const db = require("../models");
const Comment = db.comment;
const Post = db.post;
const User = db.User;

exports.createComment = (req, res) => {
  const { userId, postId, content } = req.body;

  Comment.create({
    content: content,
    UserId: userId, // Связываем комментарий с пользователем
    PostId: postId, // Связываем комментарий с постом
  })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      console.error("Error creating comment:", err);
      res.status(500).send({
        message: "An error occurred while creating the comment.",
      });
    });
};

exports.findAllCommentsForPosts = (req, res) => {
  Post.findAll({ include: Comment })
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((err) => {
      console.error("Error finding comments for posts:", err);
      res.status(500).send({
        message: "An error occurred while finding comments for posts.",
      });
    });
};

exports.findAllCommentsForPost = (req, res) => {
  const postId = req.params.id;
  console.log(req.params);
  Comment.findAll({ 
    where: { PostId: postId },
    include: User
  })
    .then((comments) => {
      console.log(comments)
      if (!comments) {
        return res
          .status(404)
          .send({ message: "Comments not found for the post" });
      }
      console.log(comments)
      res.status(200).send(comments);
    })
    .catch((err) => {
      console.error("Error finding comments for post:", err);
      res.status(500).send({
        message: "An error occurred while finding comments for the post.",
      });
    });
};

exports.deleteComment = (req, res) => {
  const id = req.params.id;

  Comment.destroy({
    where: { id },
  })
    .then(() => {
      res.status(204).send(); // No content to send after deletion
    })
    .catch((err) => {
      console.error("Error deleting comment:", err);
      res.status(500).send({
        message: "An error occurred while deleting the comment.",
      });
    });
};
