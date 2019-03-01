const express = require('express')
const router = express.Router()
const { User, validateUser } = require('../models/User')
const validate = require('../middleware/validate')
const _ = require('lodash')
const props = ['name', 'password', 'email', 'isAdmin']
const bcrypt = require('bcrypt')


router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, props))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    res.send(_.pick(user, ['name', 'email', 'isAdmin']))
})


module.exports = router