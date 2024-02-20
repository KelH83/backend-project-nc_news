const express = require("express");
const app = express();
const {
  getAllTopics,
  getEndpoints,
} = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
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

app.all("/*", invalidEndpoints);

app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

module.exports = app;
