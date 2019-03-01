const winston = require('winston')
const config = require('config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.connect(config.get('db'), { useNewUrlParser: true })
        .then(() => winston.info(`Connected ${config.get('db')}`))

    mongoose.set('useCreateIndex', true)
}

