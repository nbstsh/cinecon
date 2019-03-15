const express = require('express')
const router = express.Router()
const validate  = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const _ = require('lodash')
const { Movie, validateMovie } = require('../models/Movie')
const props = ['title', 'director', 'releaseYear', 'genres', 'runningTime', 'starring', 'country']


router.get('/',  async (req, res) => {
    const movies = await Movie.find().populate('genres', '-__v')
    res.send(movies)
})

router.post('/', [auth, admin, validate(validateMovie)], async (req, res) => {
    const movie = new Movie(
        _.pick(req.body, props)
    )
    await movie.save()

    res.send(movie)
})

router.put('/:id', [auth, admin, validateObjectId, validate(validateMovie)], async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id,  _.pick(req.body, props), { new: true })
    if (!movie) return res.status(404).send('Movie with given id was not found.')

    res.send(movie)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('Movie with given id was not found.')
    
    res.send(movie)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id).populate('genres', '-__v')
    if (!movie) return res.status(404).send('Movie with given id was not found')

    res.send(movie)
})


module.exports = router