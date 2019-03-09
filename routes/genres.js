const express = require('express')
const router = express.Router()
const { Genre, validateGenre } = require('../models/Genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const _ = require('lodash')

const props = ['name', 'color']

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.send(genres)
})

router.post('/', [auth, admin, validate(validateGenre)], async (req, res) => {
    const genre = new Genre(_.pick(req.body, props))
    await genre.save()

    res.send(genre)
})

router.put('/:id', [auth, admin, validateObjectId, validate(validateGenre)], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, _.pick(req.body, props), { new: true })
    if (!genre) return res.status(404).send('The genre with given id was not found.')

    res.send(genre)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if (!genre) return res.status(400).send('The genre with given id was not found.')

    res.send(genre)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(request.params.id)
    if (!genre) return res.status(404).send('The genre with given id was not found.')

    res.send(genre)
})


module.exports = router