const { selectAllTopics } = require("../models/topics.models");
const endpointFile = require("../endpoints.json");

function getAllTopics(req, res, next) {
  selectAllTopics()
    .then((allTopicData) => {
      res.status(200).send(allTopicData);
    })
    .catch((err) => {
      next(err);
    });
}

function getEndpoints(req, res, next) {
  res
    .status(200)
    .send(endpointFile)

    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics, getEndpoints };
