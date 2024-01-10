const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Хеширование пароля перед сохранением в базу данных
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.one('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [
      username,
      email,
      hashedPassword,
    ]);

    res.status(201).json(result);
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.one('SELECT * FROM users WHERE username = $1', [username]);

    // Сравнение хэшированного пароля с введенным паролем
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Вход успешен' });
    } else {
      res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
  }
});

module.exports = router;
