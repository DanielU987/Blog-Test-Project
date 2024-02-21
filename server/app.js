const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200,
};

// Позволяет Express парсить JSON-запросы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const User = db.user;
const Posts = db.post;
//{ force: true }
//{alter: true}
db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");
  //initial();
});

app.use(cors(corsOptions));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);
require("./routes/comment.routes")(app);
require("./routes/like.routes")(app);

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
