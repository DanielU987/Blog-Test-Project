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
  const { title, content, image } = req.body;

  try {
    const result = await db.one('INSERT INTO posts (title, content, picture) VALUES ($1, $2, $3) RETURNING *', [
      title,
      content,
      Buffer.from(image, 'base64'), // Преобразуйте строку с данными изображения в бинарный буфер
    ]);
    res.json(result);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// Обновление информации о посте
router.put('/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, image } = req.body;
  console.log("necoc"+postId,title,content,image)
  try {
    const result = await db.query('UPDATE posts SET title=$1, content=$2, picture=$3 WHERE id=$4 RETURNING *', [title, content,image, postId]);

    const updatedRow = result[0];
    res.json(updatedRow);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
