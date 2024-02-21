const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  addNewComment,
  updateArticle,
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

function getAllCommentsByArticleId(req, res, next) {
  articleId = req.params.article_id;
  const promises = [
    selectCommentsByArticleId(articleId),
    selectArticleById(articleId),
  ];

  Promise.all(promises)
    .then((promiseResolutions) => {
      res.status(200).send({ comments: promiseResolutions[0] });
    })
    .catch((err) => {
      next(err);
    });
}

function postNewCommentByArticleId(req, res, next) {
  const articleId = req.params.article_id;
  const newComment = req.body;
  addNewComment(newComment, articleId)
    .then((returnedComment) => {
      res.status(201).send({ returnedComment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const articleId = req.params.article_id;
  const newUpdate = req.body;
  selectArticleById(articleId)
    .then(() => {
      updateArticle(articleId, newUpdate).then((updatedArticle) => {
        res.status(200).send({ updatedArticle });
      });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postNewCommentByArticleId,
  patchArticle,
};
