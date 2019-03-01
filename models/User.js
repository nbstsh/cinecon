const mongoose = require('mongoose')
const Joi = require('joi')


const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}))

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(1).max(255).email().required(),
        password: Joi.string().min(8).max(50).required(),
        isAdmin: Joi.boolean()
    }

    return Joi.validatet(user, schema)
}


exports.User = User 
exports.validateUser = validateUser