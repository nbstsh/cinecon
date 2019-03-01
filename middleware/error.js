const winston = require('winston')

module.exports = (err, req, res, next) => {
    winston.error(err.message, err)
    res.status(500).send('500 Internal Server Error')
}