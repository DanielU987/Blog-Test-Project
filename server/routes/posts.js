const express = require('express');
const router = express.Router();

// Пример базы данных в памяти (для демонстрации)
let posts = [
  { id: 1, title: 'Заголовок поста 1', content: 'Содержание поста 1' },
  { id: 2, title: 'Заголовок поста 2', content: 'Содержание поста 2' },
  // Другие посты...
];

// Получение списка всех постов
router.get('/', (req, res) => {
  res.json(posts);
});

// Получение информации о конкретном посте
router.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Пост не найден' });
  }
});

// Создание нового поста
router.post('/', (req, res) => {
  const newPost = req.body;
  newPost.id = posts.length + 1;
  posts.push(newPost);

  res.status(201).json(newPost);
});

// Обновление информации о посте
router.put('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = req.body;

  posts = posts.map(post => (post.id === postId ? updatedPost : post));

  res.json(updatedPost);
});

// Удаление поста
router.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== postId);

  res.json({ message: 'Пост успешно удален' });
});

module.exports = router;
