module.exports = (sequelize, DataTypes) => {
    const PostLike = sequelize.define('likes', {});

    PostLike.associate = models => {
        PostLike.belongsTo(models.User);
        PostLike.belongsTo(models.Post);
    };
    return PostLike;
};