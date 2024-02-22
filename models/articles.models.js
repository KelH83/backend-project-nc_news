const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(articleId) {
  const queryString = `SELECT articles.*, COUNT(comment_id) AS comment_count FROM comments
  RIGHT JOIN articles ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;

  return db.query(queryString, [articleId]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    } else {
      return article.rows[0];
    }
  });
}

function selectAllArticles(sort_by = "created_at", order = "DESC", topic) {
  const validSortBy = ["created_at"];
  const validOrder = ["ASC", "DESC"];

  if (!validSortBy.includes(sort_by) && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    const queryValues = [];
    let queryString = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.votes,articles.created_at,articles.article_img_url, COUNT(comment_id) AS comment_count FROM comments
  RIGHT JOIN articles ON articles.article_id = comments.article_id`;

    if (topic) {
      queryString += ` WHERE topic =$1`;
      queryValues.push(topic);
    }

    queryString += ` GROUP BY articles.article_id`;
    queryString += ` ORDER BY ${sort_by} ${order} `;
    return db.query(queryString, queryValues).then((allArticles) => {
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

function selectAllTopics(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug =$1`, [topic])
    .then((topicData) => {
      if (topicData.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else {
        return topicData.rows;
      }
    });
}

module.exports = {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  addNewComment,
  updateArticle,
  selectAllTopics,
};
