const express = require('express')
const movies = require('../routes/movies')
const users = require('../routes/users')
const genres = require('../routes/genres')
const auth = require('../routes/auth')
const error = require('../middleware/error')
const cors = require('../middleware//cors')

module.exports = function(app) {
    app.use(express.json())
    app.use(cors)
    app.use('/api/movies', movies)
    app.use('/api/users', users)
    app.use('./api/genres', genres)
    app.use('/api/auth', auth)
    app.use(error)
}