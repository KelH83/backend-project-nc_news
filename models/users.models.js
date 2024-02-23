const db = require("../db/connection");
const format = require("pg-format");

function selectAllUsers() {
  const queryString = "SELECT * FROM users";

  return db.query(queryString).then((allUsers) => {
    return allUsers.rows;
  });
}

function selectUserById(username) {
  return db
    .query(
      `SELECT * FROM users
  WHERE username = $1;`,
      [username]
    )
    .then((userData) => {
      if (userData.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return userData.rows[0];
      }
    });
}

module.exports = { selectAllUsers, selectUserById };
