const request = require('supertest')
const { Genre } = require('../../models/Genre')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('config')

describe('/api/genres', () => {
    const DEFAULT_PATH = '/api/genres'
    let server 

    let name 
    let color
    let genre
    let _id
    let isAdmin
    let token

    beforeEach(async () => {
        server = require('../../index')
    })

    afterEach(async () => { 
        await Genre.remove({})
        await server.close() 
    })


    describe('get /', () => {
        const exec = () => {
            return request(server)
                .get(DEFAULT_PATH + '/')
        }

        beforeEach(async () => {
            name = 'a'
            color = '#000000'
            genre = new Genre({ name, color })
            await genre.save()  
        })

        it('should return genres if it is valid', async () => {
            const res = await exec()
            
            expect(res.body[0]).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body[0]).toHaveProperty('name', genre.name)
            expect(res.body[0]).toHaveProperty('color', genre.color)
        })
    })

    
    describe('post /', () => {
        const exec = () => {
            return request(server)
                .post(DEFAULT_PATH + '/')
                .send({ name, color })
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            name = 'a'
            color = '#000000'
            _id = new mongoose.Types.ObjectId().toHexString()
            isAdmin = true
            token = jwt.sign({ _id, isAdmin }, config.get('jwtPrivateKey'))
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec() 

            expect(res.status).toBe(401)
        })

        it('should return 403 if client is not admin user', async () => {
            isAdmin = false
            token = jwt.sign({ _id, isAdmin}, config.get('jwtPrivateKey'))

            const res = await exec()

            expect(res.status).toBe(403)
        })

        it('should return 401 if invalid request is sent', async () => {
            name = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })
        
        it('should return genre if it is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('name', name)
            expect(res.body).toHaveProperty('color', color)
        })

        it('should save genre if it is valid', async () => {
            await exec()

            const genre = await Genre.findOne()
            
            expect(genre).toMatchObject({ name, color })
        })
        
    })


})