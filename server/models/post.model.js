module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.BLOB,
    }
  });

  return Post;
};