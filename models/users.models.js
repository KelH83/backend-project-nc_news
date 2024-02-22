const db = require("../db/connection");
const format = require("pg-format");

function selectAllUsers() {
  const queryString = "SELECT * FROM users";

  return db.query(queryString).then((allUsers) => {
    return allUsers.rows;
  });
}

module.exports = { selectAllUsers };
