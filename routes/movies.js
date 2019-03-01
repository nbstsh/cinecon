const express = require('express')
const router = express.Router()
const validate  = require('../middleware/validate')
const _ = require('lodash')
const { Movie, validateMovie } = require('../models/Movie')
const props = ['title', 'director', 'releaseYear', 'genre', 'runningTime', 'starring', 'country']

router.get('/',  async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.post('/', validate(validateMovie), async (req, res) => {
    const movie = new Movie(
        _.pick(req.body, props)
    )
    await movie.save()

    res.send(movie)
})

router.put('/:id', validate(validateMovie), async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id,  _.pick(req.body, props), { new: true })
    if (!movie) return res.status(404).send('Movie with given id was not found.')

    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('Movie with given id was not found.')
    
    res.send(movie)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('Movie with given id was not found')

    res.send(movie)
})


module.exports = router