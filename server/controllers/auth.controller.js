const { Sequelize } = require("sequelize");
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Post = db.post;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.register = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.delete = async (req, res) => {
  
  const userId = req.params.id;
  console.log(userId);
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log("balls");
      // Check if there's a corresponding row in user_post for the given userId and postId
      db.sequelize
        .query(
          ` SELECT * FROM user_post WHERE "userId" = :userId `,
          {
            replacements: { userId: userId },
            type: Sequelize.QueryTypes.SELECT,
          }
        )
        .then((results) => {
          console.log(results)
          for (const result of results) {
            const postId = result.postId;
      
            // Delete the post
            Post.destroy({
              where: { id: postId },
            });
          }
          User.destroy({
            where: {id: userId}
          });
          return res.status(200).send({
            message: `User with id=${userId} and associated posts were deleted successfully.`,
          });
        })
        .catch((err) => {
          console.error("Error deleting user and associated posts:", error);
          res.status(500).send({
            message: "Error deleting user and associated posts.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
