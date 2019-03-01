const validate  = require('../middleware/validate')
const _ = require('lodash')
const { Movie, validateMovie } = require('../models/Movie')
const express = require('express')
const router = express.Router()


router.get('/',  async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.post('/', validate(validateMovie), async (req, res) => {
    const movie = new Movie(
        _.pick(req.body,'title', 'director', 'releaseYear', 'genre', 'runningTime', 'starring', 'country')
    )
    await movie.save()

    res.send(movie)
})

router.put('/:id', (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    res.send('put')
})

router.delete('/:id', (req, res) => {
    res.send('delete')
})

router.get('/:id', (req, res) => {
    res.send('get :id')
})


module.exports = router