module.exports = app =>{
    var router = require("express").Router();
    const Likes = require('../controllers/like.controller');

    router.post('/', Likes.likePost);
    router.delete('/:id', Likes.unlikePost);
    router.get('/count-all', Likes.countAllLikes); // Добавлен новый маршрут для подсчета общего количества лайков
    router.get('/count-one/:id', Likes.countLikesForOne); // Добавлен новый маршрут для подсчета количества лайков для определенного поста

    app.use("/api/like", router)
}