const {
  removeComment,
  selectCommentById,
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

module.exports = { deleteComment };
