const { selectAllUsers } = require("../models/users.models");

function getAllUsers(req, res, next) {
  selectAllUsers().then((allUsers) => {
    res.status(200).send({ allUsers });
  });
}

module.exports = { getAllUsers };
