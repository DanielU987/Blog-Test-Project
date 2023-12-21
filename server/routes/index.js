const express = require('express');
const router = express.Router();

// Подключение роутера для постов
const postsRouter = require('./posts');

// Использование роутера для постов по пути '/posts'
router.use('/posts', postsRouter);

module.exports = router;
