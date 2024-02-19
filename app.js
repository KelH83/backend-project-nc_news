const express = require('express')
const app = express()
app.use(express.json())
const {getAllTopics, getEndpoints} = require('./controllers/topics.controllers')

app.get('/api/topics', getAllTopics)

app.get('/api', getEndpoints)

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})


app.use((err,req,res,next) => {
    res.status(500).send({msg: 'Internal server error'})
})

module.exports = app