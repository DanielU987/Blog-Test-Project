const { Sequelize } = require("sequelize");
const db = require("../models");
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const UserPost = db.userPost;
const Like = db.like;
const Op = db.Sequelize.Op;

// Create and Save a new Post
exports.create = (req, res) => {
  const UserId = req.body.userId;
  console.log(UserId);
  User.findByPk(UserId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log("!BBBB");
      // Create a Post with UserId
      const post = {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
      };

      // Save Post in the database
      Post.create(post)
        .then((data) => {
          user.addPost(data, { through: { UserId: UserId } });
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Post.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAll = (req, res) => {
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "username", "email"],
        include: Like,
      },
      { model: Like },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error("Error finding data:", error);
      res.status(500).send("Internal Server Error");
    });
};

exports.findOne = (req, res) => {
  const PostId = req.params.id;
  Post.findByPk(PostId, {
    include: [Comment, Like, User], // Укажите модели, которые вы хотите включить
  })
    .then((post) => {
      if (!post) {
        return res.status(404).send("Пост не найден");
      }
      res.send(post);
    })
    .catch((error) => {
      console.error("Ошибка при поиске поста:", error);
      res.status(500).send("Внутренняя ошибка сервера");
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Post with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Post.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Post was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id,
      });
    });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  Post.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Posts were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all posts.",
      });
    });
};
