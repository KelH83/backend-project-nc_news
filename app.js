const express = require("express");
const app = express();
app.use(express.json());
const {
  getAllTopics,
  getEndpoints,
} = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
