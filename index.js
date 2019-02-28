const winston = require('winston')
const express = require('express')
const app = express()


require('./startup/logging')()
require('./startup/db')()
require('./startup/config')(app)
require('./startup/validation')()


const PORT = process.env.PORT || 3000
app.listen(PORT, () => winston.info(`Start listening on port ${PORT}`))