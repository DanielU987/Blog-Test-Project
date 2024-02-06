const { Sequelize } = require("sequelize");
const db = require("../models");
const { isNullOrUndefined } = require("util");
const Post = db.post;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Post
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  console.log("!AAAA");
  const userId = req.body.userId;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log("!BBBB");
      // Create a Post with userId
      const post = {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
      };

      // Save Post in the database
      Post.create(post)
        .then((data) => {
          user.addPost(data);
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

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Post.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
  const postId = req.params.id;
  const userId = req.query.userId;
  
  // Check if Post exists by postId
  Post.findByPk(postId)
    .then((post) => {
      if(!userId){
        console.log("userId"+userId)
        const responseData = {
          post: post,
        };
        return res.send(responseData);
      }
      
      // Check if there's a corresponding row in user_post for the given userId and postId
      db.sequelize
        .query(
          `
        SELECT *
        FROM user_post
        WHERE "postId" = :postId AND "userId" = :userId
        `,
          {
            replacements: { postId: postId, userId: userId },
            type: Sequelize.QueryTypes.SELECT,
          }
        )
        .then((results) => {
          const responseData = {
            post: post,
            userPostFound: results.length > 0,
          };
          res.send(responseData);
        })
        .catch((err) => {
          console.error("Error retrieving UserPost data:", err);
          res.status(500).send({
            message: "Error retrieving UserPost data.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Post with id=" + postId,
      });
    });
};

// Update a Post by the id in the request
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

// Delete a Post with the specified id in the request
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
