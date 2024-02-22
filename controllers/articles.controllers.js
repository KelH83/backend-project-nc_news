const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  addNewComment,
  updateArticle,
  selectAllTopics,
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
  const { sort_by, order, topic } = req.query;
  if (topic) {
    const promises = [
      selectAllArticles(sort_by, order, topic),
      selectAllTopics(topic),
    ];
    Promise.all(promises)
      .then((promiseResolutions) => {
        res.status(200).send({ allArticles: promiseResolutions[0] });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    selectAllArticles(sort_by, order)
      .then((allArticles) => {
        res.status(200).send({ allArticles });
      })
      .catch((err) => {
        next(err);
      });
  }
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
  const promises = [
    addNewComment(newComment, articleId),
    selectArticleById(articleId),
  ];
  Promise.all(promises)
    .then((promiseResolutions) => {
      res.status(201).send({ returnedComment: promiseResolutions[0] });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const articleId = req.params.article_id;
  const newUpdate = req.body;
  const promises = [
    updateArticle(articleId, newUpdate),
    selectArticleById(articleId),
  ];
  Promise.all(promises)
    .then((promiseResolutions) => {
      res.status(200).send({ updatedArticle: promiseResolutions[0] });
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
