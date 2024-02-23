const {
  removeComment,
  selectCommentById,
  patchComment,
} = require("../models/comments.models");

function deleteComment(req, res, next) {
  const commentId = req.params.comment_id;
  const promises = [selectCommentById(commentId), removeComment(commentId)];

  Promise.all(promises)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
}

function patchCommentById(req, res, next) {
  const commentId = req.params.comment_id;
  votesToAdd = req.body;
  const promises = [
    selectCommentById(commentId),
    patchComment(commentId, votesToAdd),
  ];

  Promise.all(promises)
    .then((promiseResolutions) => {
      res.status(200).send({ updatedComment: promiseResolutions[1] });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteComment, patchCommentById };
