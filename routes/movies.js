const _ = require('lodash')
const { Movie, validate } = require('../models/Movie')
const express = require('express')
const router = express.Router()


router.get('/',  async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const movie = new Movie(
        _.pick(req.body,'title', 'director', 'releaseYear', 'genre', 'runningTime', 'starring', 'country')
    )
    await movie.save()

    res.send(movie)
})

router.put('/:id', (req, res) => {
    res.send('put')
})

router.delete('/:id', (req, res) => {
    res.send('delete')
})

router.get('/:id', (req, res) => {
    res.send('get :id')
})


module.exports = router