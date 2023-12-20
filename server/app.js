const express = require('express');
const app = express();
const postsRouter = require('./routes/posts');
const port = 3000;

// Подключение маршрутов для постов
app.use('/posts', postsRouter);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Обработка всех маршрутов Vue через index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту http://localhost:${port}/`);
});
