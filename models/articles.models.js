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
      if (article.rows.length === 0) {
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

function selectCommentsByArticleId(articleId) {
  const queryString = `SELECT * FROM comments`;
  const articleSelection = ` WHERE article_id = $1`;

  return db
    .query(`${queryString}${articleSelection};`, [articleId])
    .then((comments) => {
      return comments.rows;
    });
}

function addNewComment(newComment, articleId) {
  const commentToAdd = [newComment.username, +articleId, newComment.body];
  const queryString = format(
    `INSERT INTO comments
    (author, article_id, body) 
    VALUES 
    %L
    RETURNING *;`,
    [commentToAdd]
  );

  return db.query(queryString).then((returnedComment) => {
    return returnedComment.rows;
  });
}

function updateArticle(articleId, newUpdate) {
  const votes = newUpdate.inc_votes;
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  return db.query(queryString, [votes, articleId]).then((updatedArticle) => {
    return updatedArticle.rows;
  });
}

module.exports = {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  addNewComment,
  updateArticle,
};
