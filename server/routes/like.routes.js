module.exports = app =>{
    var router = require("express").Router();
    const PostLikeController = require('../controllers/like.controller');

    router.post('/', PostLikeController.likePost);
    router.delete('/:id', PostLikeController.unlikePost);
    app.use("/api/like", router)
}