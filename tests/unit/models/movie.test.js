const { validateMovie } = require('../../../models/Movie')
const ObjectId = require('mongoose').Types.ObjectId

describe('validateMovie', () => {
    let movie 

    const exec = () => {
        const { error } = validateMovie(movie)
        return error
    }

    beforeEach(() => {
        movie = {
            title: 'a',
            director: 'a',
            releaseYear: '2019',
            genres: [new ObjectId().toHexString()],
            runningTime: 1,
            starring: 'a',
            country: 'USA'
        }
    })

    describe('title', () => {
        it('shoudl not return error if it is valid', () => {
            const error = exec()
    
            expect(error).toBeNull()
        })
    
        it('should return error if title is less than 1 characters.', () => {
            movie.title = ''
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if title is more than 255 characters.', () =>  {
            movie.title = new Array(257).join('a')
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if title is not provided.', () => {
            delete movie.title 
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if title is not string.', () => {
            movie.title = 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    })

    describe('director', () => {
        it('should return error if director is not string.', () => {
            movie.title = 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if director is less than 1 character.', () => {
            movie.title = ''
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if director is more than 255 characters.', () => {
            movie.title = new Array(257).join('a')
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should should not return error even if director is empty.', () => {
            delete movie.director
    
            const error = exec()
    
            expect(error).toBeNull()
        })
    })
    
    describe('releaseYear', () => {
        it('should should return error if releaseYear is not number.', () => {
            movie.releaseYear = 'a'
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should return error if releaseYear is less than 1900.', () => {
            movie.releaseYear = 1899
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should return error if releaseYear is more than current Year.', () => {
            movie.releaseYear = new Date().getFullYear() + 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should not return error even if releaseYear is empty.', () => {
            delete movie.releaseYear
    
            const error = exec()
    
            expect(error).toBeNull()
        })
    })

    describe('runningTime', () => {
        it('should should return error if runningTime is not number.', () => {
            movie.runningTime = 'a'
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should return error if runningTime is less than 1.', () => {
            movie.runningTime = 0
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should return error if runningTime is more than 1024.', () => {
            movie.runningTime = 1025
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
        
        it('should should not return error even if runningTime is empty.', () => {
            delete movie.runningTime
    
            const error = exec()
    
            expect(error).toBeNull()
        })
    })

    describe('starring', () => {
        it('should return error if starring is less than 1 characters.', () => {
            movie.starring = ''
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if starring is more than 255 characters.', () =>  {
            movie.starring = new Array(257).join('a')
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if starring is not string.', () => {
            movie.starring = 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })

        it('should not return error event if starring is not provided.', () => {
            delete movie.starring 
            
            const error = exec()
    
            expect(error).toBeNull()
        })
    })

    describe('country', () => {
        it('should return error if country is less than 1 characters.', () => {
            movie.country = ''
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if country is more than 50 characters.', () =>  {
            movie.country = new Array(52).join('a')

            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if country is not string.', () => {
            movie.country = 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })

        it('should not return error event if country is not provided.', () => {
            delete movie.country 
            
            const error = exec()
    
            expect(error).toBeNull()
        })
    })

    describe('thumnail', () => {
        it('should return error if country is less than 1 characters.', () => {
            movie.country = ''
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if country is more than 1024 characters.', () =>  {
            movie.country = new Array(1026).join('a')

            const error = exec()
    
            expect(error).not.toBeNull()
        })
    
        it('should return error if country is not string.', () => {
            movie.country = 1
    
            const error = exec()
    
            expect(error).not.toBeNull()
        })

        it('should not return error event if country is not provided.', () => {
            delete movie.country 
            
            const error = exec()
    
            expect(error).toBeNull()
        })
    })

})
