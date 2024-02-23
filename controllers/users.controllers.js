const { selectAllUsers, selectUserById } = require("../models/users.models");

function getAllUsers(req, res, next) {
  selectAllUsers()
    .then((allUsers) => {
      res.status(200).send({ allUsers });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserById(req, res, next) {
  const username = req.params.username;
  selectUserById(username)
    .then((userData) => {
      res.status(200).send({ userData });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserById };
