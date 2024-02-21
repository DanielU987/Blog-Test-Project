module.exports = (sequelize, Sequelize) => {
  const UserPost = sequelize.define("UserPosts",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return UserPost;
};
