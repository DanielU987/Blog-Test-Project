const express = require('express');
const router = express.Router();
const db = require('../db');

// Получение списка всех постов
router.get('/', async (req, res) => {
  try {
    const posts = await db.any('SELECT * FROM posts');
    res.json(posts);
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Получение информации о конкретном посте
router.get('/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await db.one('SELECT * FROM posts WHERE id = $1', [postId]);
    res.json(post);
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    res.status(404).json({ error: 'Пост не найден' });
  }
});

// Создание нового поста
router.post('/', async (req, res) => {
  const newPost = req.body;
  try {
    const result = await db.one('INSERT INTO posts(title, content) VALUES($1, $2) RETURNING *', [
      newPost.title,
      newPost.content,
    ]);
    res.status(201).json(result);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Обновление информации о посте
router.put('/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = req.body;
  try {
    const result = await db.one('UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *', [
      updatedPost.title,
      updatedPost.content,
      postId,
    ]);
    res.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    res.status(404).json({ error: 'Пост не найден' });
  }
});

// Удаление поста
router.delete('/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    await db.none('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: 'Пост успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    res.status(404).json({ error: 'Пост не найден' });
  }
});

module.exports = router;
