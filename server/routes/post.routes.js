module.exports = app => {
  const posts = require("../controllers/post.controller");

  var router = require("express").Router();

  // Create a new Post
  router.post("/create", posts.create);

  // Retrieve all Posts
  router.get("/", posts.findAll);

  // Retrieve a single Post with id
  router.get("/:id", posts.findOne);

  // Update a Post with id
  router.put("/edit/:id", posts.update);

  // Delete a Post with id
  router.delete("/:id", posts.delete);

  // Create a new Post
  router.delete("/", posts.deleteAll);

  app.use('/api/posts', router);
};