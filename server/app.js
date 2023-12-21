const express = require('express');
const app = express();
const mainRouter = require('./routes/index');

// Позволяет Express парсить JSON-запросы
app.use(express.json());

// Использует роутер для обработки маршрутов
app.use('/', mainRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
