const Joi = require('joi')
const mongoose = require('mongoose')

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
    genre: {
        type: String,
        minlength: 1,
        maxlength: 255
    },
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
    }
})


const Movie = mongoose.model('Movie', movieSchema)

const validateMovie = (movie) => {
    const currentYear = new Date().getFullYear()

    const schema = {
        title: Joi.string().min(1).max(255).required(),
        director: Joi.string().min(1).max(255),
        releaseYear: Joi.number().min(1900).max(currentYear),
        genre: Joi.string().min(1).max(255),
        runningTime: Joi.number().min(1).max(1024),
        starring: Joi.string().min(1).max(255),
        country: Joi.string().min(1).max(50)
    }

    return Joi.validate(movie, schema)
}


exports.Movie = Movie
exports.validate = validateMovie