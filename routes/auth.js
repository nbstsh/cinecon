const express = require('express')
const router = express.Router()
const Joi = require('joi')
const bcrypt = require('bcrypt')
const validate = require('../middleware/validate')
const { User } = require('../models/User')

router.post('/', validate(validateInput), async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid password or email')

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) return res.status(400).send('Invalid password or email')

    const token = user.generateAuthToken()
    res.send(token)
})

function validateInput(input) {
    const schema = {
        email: Joi.string().min(1).max(255).email().required(),
        password: Joi.string().min(8).max(50).required()
    }

    return Joi.validate(input, schema)
}

module.exports = router