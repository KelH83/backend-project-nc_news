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
  const endpointsObj = {};
  for (const keys in endpointFile) {
    endpointsObj[keys] = JSON.stringify(endpointFile[keys]);
  }
  res.status(200).send(endpointsObj)

    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics, getEndpoints };
