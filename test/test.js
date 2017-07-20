const assert = require('assert')

// @TODO refactor these unit tests in small units
describe('Initialization of tests', () => {
  it('app presence', () => {
    assert.equal('function', typeof require('../src/app'))
  })
})

require('../src/app')({ root : __dirname }, (app) => {
    describe('App Architecture', () => {
        describe(`app.* tests`, () => {
            it('app.* exists', () => {
                assert.equal('object', typeof app)
            })

            it('app.drivers.* exists', () => {
                assert.equal('object', typeof app.drivers)
            })

            it('app.models.* exists', () => {
                assert.equal('object', typeof app.models)
            })

            it('app.controllers.* exists', () => {
                assert.equal('object', typeof app.controllers)
            })
        })

        describe(`app.drivers.* tests`, () => {
            it('app.drivers.logger exists', () => {
                assert.equal('object', typeof app.drivers.logger)
            })
            it('app.drivers.logger.error exists', () => {
                assert.equal('function', typeof app.drivers.logger.error)
            })
            it('app.drivers.logger.log exists', () => {
                assert.equal('function', typeof app.drivers.logger.log)
            })
            it('app.drivers.logger.warn exists', () => {
                assert.equal('function', typeof app.drivers.logger.warn)
            })
            it('app.drivers.logger.success exists', () => {
                assert.equal('function', typeof app.drivers.logger.success)
            })
        })
    })
})
