const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(articleId) {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [articleId]
    )
    .then((article) => {
      const arrayLength = article.rows.length;
      if (arrayLength === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article.rows[0];
      }
    });
}

function selectAllArticles(sort_by = "created_at", order = "DESC") {
  validSortBy = ["created_at"];
  validOrder = ["ASC", "DESC"];

  const queryString = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.votes,articles.created_at,articles.article_img_url, COUNT(comment_id) AS comment_count FROM comments
  RIGHT JOIN articles ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;
  const sortString = `ORDER BY ${sort_by} ${order} `;

  if (!validSortBy.includes(sort_by) && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return db.query(`${queryString} ${sortString};`).then((allArticles) => {
      return allArticles.rows;
    });
  }
}

function selectCommentCount() {
  return db.query(`SELECT article_id, COUNT(comment_id) from comments 
  GROUP BY article_id`);
}

module.exports = { selectArticleById, selectAllArticles, selectCommentCount };
