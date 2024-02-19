const {selectAllTopics} = require('../models/topics.models')

function getAllTopics(req, res, next){
    selectAllTopics().then((allTopicData) => {
        res.status(200).send(allTopicData)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllTopics}