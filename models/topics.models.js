const db = require("../db/connection")
const format = require ('pg-format')

function selectAllTopics(){
    return db.query(`SELECT * FROM topics`).then((result) =>{
        return result.rows
    })
}

module.exports = {selectAllTopics}