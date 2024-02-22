const db = require("../db/connection");
const format = require("pg-format");

function removeComment(commentId) {
  const queryString = `DELETE FROM comments`;
  const commentSelection = ` WHERE comment_id = $1`;
  return db.query(`${queryString} ${commentSelection};`, [commentId]);
}

function selectCommentById(commentId) {
  const queryString = `SELECT * FROM comments`;
  const commentSelection = ` WHERE comment_id = $1`;
  return db
    .query(`${queryString} ${commentSelection};`, [commentId])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return comment.rows;
      }
    });
}

module.exports = { removeComment, selectCommentById };
