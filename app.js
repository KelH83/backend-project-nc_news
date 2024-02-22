const express = require("express");
const app = express();
app.use(express.json());
const {
  getAllTopics,
  getEndpoints,
} = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postNewCommentByArticleId,
  patchArticle,
} = require("./controllers/articles.controllers");

const { deleteComment } = require("./controllers/comments.controllers");

const { getAllUsers } = require("./controllers/users.controllers");

const {
  customErrors,
  psqlErrors,
  serverErrors,
  invalidEndpoints,
} = require("./controllers/errors.controllers");

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postNewCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);

app.all("/*", invalidEndpoints);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
