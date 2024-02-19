const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(articleId) {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [articleId]
    )
    .then((articleData) => {
      const arrayLength = articleData.rows.length;
      if (arrayLength === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return articleData.rows[0];
      }
    });
}

module.exports = { selectArticleById };
