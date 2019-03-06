const express = require('express')
const router = express.Router()
const { User, validateUser } = require('../models/User')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const _ = require('lodash')
const props = ['name', 'password', 'email', 'isAdmin']
const bcrypt = require('bcrypt')


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v')
    if (!user) return res.status(404).send('User with given id was not found')

    res.send(user)
})

router.post('/', [auth, admin, validate(validateUser)], async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, props))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    const token = user.generateAuthToken()

    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', 'isAdmin']))
})


module.exports = router