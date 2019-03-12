const mongoose = require('mongoose')
const Joi = require('joi')


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 1,
        max: 50,
        required: true
    },
    color: {
        type: String,
        match: /^#[0-9a-f]{6}$/i, // Hexadecimal (7 letters string )
        default: '#ffffff' 
    }
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(1).max(50).required(),
        color: Joi.string().regex( /^#[0-9a-f]{6}$/i)
    }

    return Joi.validate(genre, schema)
}

exports.Genre = Genre
exports.validateGenre = validateGenre