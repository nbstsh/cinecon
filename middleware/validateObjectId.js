const mongoose = require('mongoose')

module.exports = (req, res, next) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!isValidId) return res.status(400).send('Invalid id')

    next()
}