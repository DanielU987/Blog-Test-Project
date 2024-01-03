const express = require('express');
const app = express();
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:8080',  // Замените на ваш фактический адрес Vue-приложения
  optionsSuccessStatus: 200,
};
// Подключаем роутер
const mainRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
// Позволяет Express парсить JSON-запросы
app.use(express.json());

app.use(cors(corsOptions))
// Использует роутер для обработки маршрутов
app.use('/', mainRouter);
app.use('/api/posts', postsRouter);



const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
