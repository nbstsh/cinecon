const Joi = require('joi')
const mongoose = require('mongoose')
Joi.objectId = require('joi-objectid')(Joi)

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    director: {
        type: String,
        minlength: 1,
        maxlength: 255
    },
    releaseYear: {
        type: Number,
        min: 1900,
        validate: {
            validator: function(v) { return v <= new Date().getFullYear()},
            message: `releaseYear should should be before ${new Date().getFullYear()}`
        }
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    runningTime: {
        type: Number,
        min: 1,
        max: 1024
    },
    starring: {
        type: String,
        minlength: 1,
        maxlength: 255
    },
    country: {
        type: String,
        minlength: 1,
        maxlength: 50
    },
    thumnail: {
        type: String,
        minlength: 1,
        maxlength: 1024
    }
})


const Movie = mongoose.model('Movie', movieSchema)

const validateMovie = (movie) => {
    const currentYear = new Date().getFullYear()

    const schema = {
        title: Joi.string().min(1).max(255).required(),
        director: Joi.string().min(1).max(255),
        releaseYear: Joi.number().min(1900).max(currentYear),
        genres: Joi.array().items(Joi.objectId()),
        runningTime: Joi.number().min(1).max(1024),
        starring: Joi.string().min(1).max(255),
        country: Joi.string().min(1).max(50),
        thumnail: Joi.string().min(1).max(1024)
    }

    return Joi.validate(movie, schema)
}


exports.Movie = Movie
exports.validateMovie = validateMovie