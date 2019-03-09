const { validateGenre } = require('../../../models/Genre')


describe('validateGenre', () => {
    let genre 

    const exec = () => {
        const { error } = validateGenre(genre)
        return error
    }

    beforeEach(() => {
        genre = {
            name: 'a',
            color: '#000000'
        }
    })

    it('should not return error if it is valid', () => {
        const res = exec()
        expect(res).toBeNull()
    })

    it('should return errror if name is not privided', () => {
        delete genre.name
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return error if name is less than 1 characters', () => {
        genre.name = ''
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return error if name is more than 50 characters', () => {
        genre.name = new Array(52).join('a')
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return error if name is not string', () => {
        genre.name = 1
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return error if color is not string', () => {
        genre.color = 1
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return error if color is not /^#[0-9a-f]/i', () => {
        genre.color = '#00000p'
        const res = exec()
        expect(res).not.toBeNull()
    })

    it('should return null if color is not provided', () => {
        delete genre.color 
        const res = exec()
        expect(res).toBeNull()
    })
})