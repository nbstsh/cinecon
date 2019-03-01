const config = require('config')


exports.getDBConnectionStr = () => {
    const { prefix, userName, password, host, dbName } = config.get('db')

    if (!password) {
        throw new Error('FATAL ERROR: dbPassword is not defined.')
    }
    
    return `${prefix}://${userName}:${password}@${host}/${dbName}`
}