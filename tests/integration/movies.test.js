const request = require('supertest')
const { Movie } = require('../../models/Movie')
const { Genre } = require('../../models/Genre')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId
const config = require('config')

describe('/aip/movies', () => {
    let server
    let genre
    let movie 
    let isAdmin
    let token 
    let _id
    let defaultGenreObj
    let defaultMovieObj

    beforeEach(async () => { 
        server = require('../../index') 

        defaultGenreObj = { 
            name: 'drama',
            color: '#ffffff'
        }

        defaultMovieObj = {
            title: 'a',
            director: 'a',
            releaseYear: 2019,
            genres: [],
            runningTime: 1,
            starring: 'a',
            country: 'USA'
        }

        genre = new Genre(defaultGenreObj)
        await genre.save()

        defaultMovieObj.genres.push(genre._id)
    })

    afterEach(async () => {
        await server.close()
        await Movie.remove({})
        await Genre.remove({})
    })

    const expectToHaveDefaultMovieProps = (res) => {
        expect(res).toHaveProperty('title', defaultMovieObj.title)
        expect(res).toHaveProperty('director', defaultMovieObj.director)
        expect(res).toHaveProperty('releaseYear', defaultMovieObj.releaseYear)
        expect(res).toHaveProperty('runningTime', defaultMovieObj.runningTime)
        expect(res).toHaveProperty('starring', defaultMovieObj.starring)
        expect(res).toHaveProperty('country', defaultMovieObj.country)
    }

    const expectToHaveDefaultGenreProps = (res) => {
        expect(res).toHaveProperty('_id', genre._id.toHexString())
        expect(res).toHaveProperty('name', genre.name)
        expect(res).toHaveProperty('color', genre.color)
    }
    
    describe('GET /', () => {

        const exec = () => {
            return request(server)
                .get('/api/movies')
        }

        beforeEach(async () => {
            movie = new Movie(defaultMovieObj)
            await movie.save()
        })

        it('shoud return movies if it is valid', async () => {
            const res = await exec() 

            expect(res.body[0]).toHaveProperty('_id', movie._id.toHexString())
            expectToHaveDefaultMovieProps(res.body[0])
            expectToHaveDefaultGenreProps(res.body[0].genres[0])
        })
    })

    describe('POST /', () => {
        const exec = () => {
            return request(server)
                .post('/api/movies')
                .send(defaultMovieObj)
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            isAdmin = true
            _id = new ObjectId()
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
            defaultMovieObj.title = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })
        
        it('should return movie if it is valid', async () => {
            const res = await exec()

            expectToHaveDefaultMovieProps(res.body)
        })

        it('should save movie if it is valid', async () => {
            await exec()

            const movie = await Movie.findOne()
            
            expectToHaveDefaultMovieProps(movie)
        })
    })

    describe('PUT /:id', () => {
        let movieId
         
        const exec = () => {
            return request(server)
                .put('/api/movies/' + movieId)
                .send(defaultMovieObj) 
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            const movie = new Movie({ title: 'x' })
            await movie.save()
            movieId = movie._id 

            isAdmin = true
            _id = new ObjectId()
            token = jwt.sign({ _id, isAdmin }, config.get('jwtPrivateKey'))
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

        it('sould return 404 if no movie with given id exists', async () => {
            movieId = new ObjectId().toHexString()

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('shoudl return 404 if invalid id is passed', async () => {
            movieId = '123'

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should reutrn 400 if invalid name is passed', async () => {
            defaultMovieObj.title = ''
            
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return updated genre if it is valid', async () => {
            const res = await exec()

            expectToHaveDefaultMovieProps(res.body)
        })

        it('shoud update genre in DB if it is valid', async () => {
            await exec()

            const updatedMovies = await Movie.findById(movieId)
                
            expectToHaveDefaultMovieProps(updatedMovies)
        })
    })

    describe('DELETE /:id', () => {
        let movieId

        const exec = () => {
            return request(server) 
                .delete('/api/movies/' + movieId)
                .set('x-auth-token', token)
        }
        
        beforeEach(async () => {
            movie = new Movie(defaultMovieObj)
            await movie.save()
            movieId = movie._id

            isAdmin = true
            _id = new ObjectId()
            token = jwt.sign({ _id, isAdmin }, config.get('jwtPrivateKey'))
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

        it('sould return 404 if no movie with given id exists', async () => {
            movieId = new ObjectId().toHexString()

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('shoudl return 404 if invalid id is passed', async () => {
            movieId = '123'

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return deleted movie if it is valid', async () => {
            const res = await exec()

            expectToHaveDefaultMovieProps(res.body)
        })

        it('should delete genre if it is valid.', async () => {
            await exec()

            const res = await Movie.findById(movie._id)

            expect(res).toBeNull()
        })
    })

    describe('GET /:id', () => {
        let movieId 

        const exec = () => {
            return request(server)
                .get('/api/movies/' + movieId)
        }

        beforeEach(async () => {
            movie = new Movie(defaultMovieObj)
            await movie.save()
            movieId = movie._id
        })

        it('shoudl return 404 if invalid id is passed', async () => {
            movieId = 'a'

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if no genre with given id exists', async () => {
            movieId = new ObjectId().toHexString

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return movie if it is valid', async () => {
            const res = await exec()

            expectToHaveDefaultMovieProps(res.body)
        })
    })

})
