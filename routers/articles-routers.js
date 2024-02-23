const articlesRouter = require('express').Router();
const {
    getArticleById,
    getAllArticles,
    getAllCommentsByArticleId,
    postNewCommentByArticleId,
    patchArticle,
  } = require("../controllers/articles.controllers");

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id/comments', getAllCommentsByArticleId);
articlesRouter.get('/:article_id', getArticleById);

articlesRouter.post('/:article_id/comments', postNewCommentByArticleId);

articlesRouter.patch('/:article_id', patchArticle);


module.exports = articlesRouter;