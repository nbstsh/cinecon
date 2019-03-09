const request = require('supertest')
const { Genre } = require('../../models/Genre')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId
const config = require('config')

describe('/api/genres', () => {
    const DEFAULT_PATH = '/api/genres'
    let server 

    let id
    let name 
    let color
    let genre
    let token

    beforeEach(async () => {
        server = require('../../index')
    })

    afterEach(async () => { 
        await Genre.remove({})
        await server.close() 
    })


    describe('GET /', () => {
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

    
    describe('POST /', () => {
        const exec = () => {
            return request(server)
                .post(DEFAULT_PATH + '/')
                .send({ name, color })
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            name = 'a'
            color = '#000000'
            _id = new ObjectId().toHexString()
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


    describe('PUT /:id', () => {
        const exec = () => {
            return request(server)
                .put(DEFAULT_PATH + `/${id}`)
                .set('x-auth-token', token)
                .send({ name, color })
        }

        beforeEach(async () => {
            genre = new Genre({
                name: 'a',
                color: '#000000'
            })
            await genre.save()

            id = genre._id
            token = jwt.sign({ _id: new ObjectId().toHexString(),isAdmin: true}, config.get('jwtPrivateKey'))
            name = 'b'
            color = '#aaaaaa'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 403 if client is not admin', async () => {
            token = jwt.sign({ _id: new ObjectId().toHexString, isAdmin: false }, config.get('jwtPrivateKey'))

            const res = await exec()

            expect(res.status).toBe(403)
        })

        it('sould return 404 if no genre with given id exists', async () => {
            id = new ObjectId().toHexString()

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('shoudl return 404 if invalid id is passed', async () => {
            id = '123'

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should reutrn 400 if invalid name is passed', async () => {
            name = ''
            
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return updated genre if it is valid', async () => {
            const res = await exec()

            expect(res.body).toMatchObject({ name, color })
        })

        it('shoud update genre in DB if it is valid', async () => {
            await exec()

            const updatedGenre = await Genre.findById(genre._id)
                
            expect(updatedGenre).toMatchObject({ name, color })
        })
    })


    describe('DELETE /:id', () => {

        exec = () => {
            return request(server)
                .delete(DEFAULT_PATH + `/${id}`)
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            name = 'a'
            color = '#000000'
            genre = new Genre({ name, color })
            await genre.save()

            token = jwt.sign({ _id: new ObjectId().toHexString(), isAdmin: true }, config.get('jwtPrivateKey'))
            id = genre._id
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })


        it('should return 403 if client is not admin user', async () => {
            token = jwt.sign({ _id: new ObjectId().toHexString(), isAdmin: false }, config.get('jwtPrivateKey'))

            const res = await exec()

            expect(res.status).toBe(403)
        })

        it('should return 404 if no genre with given id exists.', async () => {
            id = 'a'

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('shoudl return genre if it is valid.', async () => {
            const res = await exec()

            expect(res.body).toMatchObject({ name, color })
        })

        it('should delete genre if it is valid.', async () => {
            await exec()

            const res = await Genre.findById(genre._id)

            expect(res).toBeNull()
        })
    })

})