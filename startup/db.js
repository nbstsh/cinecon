const winston = require('winston')
const config = require('config')
const mongoose = require('mongoose')
const { getDBConnectionStr } = require('./helper')

module.exports = function() {
    const db = getDBConnectionStr()
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to MongoDB.`))

    mongoose.set('useCreateIndex', true)
}

