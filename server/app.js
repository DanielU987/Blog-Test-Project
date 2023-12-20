const express = require('express');
const app = express();
const postsRouter = require('./routes/posts');
const port = 3000;

// Подключение маршрутов для постов
app.use('/posts', postsRouter);

// Отправка файла Main.vue при обращении к корневому маршруту
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Main.vue'));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

// Пример базы данных в памяти (для демонстрации)
let posts = [
  { id: 1, title: 'Заголовок поста 1', content: 'Содержание поста 1' },
  { id: 2, title: 'Заголовок поста 2', content: 'Содержание поста 2' },
  // Другие посты...
];

// Получение списка всех постов
postsRouter.get('/', (req, res) => {
  res.json(posts);
});

// Получение информации о конкретном посте
postsRouter.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Пост не найден' });
  }
});

// Создание нового поста
postsRouter.post('/', (req, res) => {
  const newPost = req.body;
  newPost.id = posts.length + 1;
  posts.push(newPost);

  res.status(201).json(newPost);
});

// Обновление информации о посте
postsRouter.put('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = req.body;

  posts = posts.map(post => (post.id === postId ? updatedPost : post));

  res.json(updatedPost);
});

// Удаление поста
postsRouter.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== postId);

  res.json({ message: 'Пост успешно удален' });
});

module.exports = postsRouter;
