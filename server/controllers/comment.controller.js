const db = require("../models");
const Comment = db.comment;


exports.createComment = (req, res) => {
  const { userId, postId, content } = req.body;

  Comment.create({
    userId,
    postId,
    content,
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

exports.getAllComments = (req, res) => {
  const postId = req.params.postId;

  Comment.findAll({
    where: { postId },
    include: [db.User], // Include user details for each comment
  })
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      console.error("Error fetching comments:", err);
      res.status(500).send({
        message: "An error occurred while fetching the comments.",
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
