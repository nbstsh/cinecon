

module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
}