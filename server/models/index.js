const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.post = require("../models/post.model.js")(sequelize, Sequelize);
db.like = require("../models/like.model.js")(sequelize, Sequelize);
db.comment = require("../models/comment.model.js")(sequelize, Sequelize);
db.userPost = require("../models/userPost.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.user.belongsToMany(db.post, {
  through: "user_post"
});

db.user.hasMany(db.like);
db.like.belongsTo(db.user);

db.post.hasMany(db.like);
db.like.belongsTo(db.post);

db.userPost.belongsTo(db.user);
db.userPost.belongsTo(db.post);

db.post.hasMany(db.comment);
db.comment.belongsTo(db.post);
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
