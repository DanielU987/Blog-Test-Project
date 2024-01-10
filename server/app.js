const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");  // Обратите внимание на это место
const bodyParser = require('body-parser');

const corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Подключаем роутер
const mainRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const authRouter = require('./routes/auth');
// Позволяет Express парсить JSON-запросы
app.use(express.json());

// Создаем объект Pool для использования в connect-pg-simple
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blogdb',
  password: '123',
  port: 5432,
});

app.use(
  session({
    store: new pgSession({
      pool: pool,  // Используем созданный объект Pool здесь
    }),
    secret: "EhLYTtYI72FVN1ucXOJAFnxXonFap4o9",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors(corsOptions));

// Использует роутер для обработки маршрутов
app.use("/", mainRouter);
app.use("/api/posts", postsRouter);
app.use('/api/auth', authRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
