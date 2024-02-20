const {
  selectArticleById,
  selectAllArticles,
  selectCommentCount,
} = require("../models/articles.models");

function getArticleById(req, res, next) {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const { sort_by, order } = req.query;
  selectAllArticles(sort_by, order)
    .then((allArticles) => {
      res.status(200).send(allArticles);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getAllArticles };
