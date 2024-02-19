const { selectArticleById } = require("../models/articles.models");

function getArticleById(req, res, next) {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((articleData) => {
      res.status(200).send({ articleData });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };
