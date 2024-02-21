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
} = require("./controllers/articles.controllers");

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

app.all("/*", invalidEndpoints);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
