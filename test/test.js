const assert = require('assert')
const should = require('should')

// @TODO refactor these unit tests in small units
describe('Initialization of tests', () => {
    it('app presence', () => {
        assert.equal('function', typeof require('../src/app'))
    })
})

process.env['NODE_CONFIG_DIR'] = __dirname + '/config'

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
})

require('../src/app')({root: __dirname}, (app) => {
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

        describe('app.drivers.logger tests', () => {
            it('should log tests', function () {
                app.config.log = true
                app.drivers.logger.log('param1 %s', 'param2', 'param3')
                app.drivers.logger.warn('param1', 'param2')
                app.drivers.logger.error('error', new Error('test error'))
            })
        })

        describe('app.models.* tests', function () {
            it('should have models', function () {
                should.exist(app.models)
                should.exist(app.models._model)
                should.exist(app.models.user)
            })

            it('models should have base methods', function () {
                should.exist(app.models._model.prototype.save)
                should.equal(typeof app.models._model.prototype.save, 'function')
                should.exist(app.models._model.prototype.delete)
                should.equal(typeof app.models._model.prototype.delete, 'function')
                should.exist(app.models._model.prototype.read)
                should.equal(typeof app.models._model.prototype.read, 'function')
                should.exist(app.models._model.prototype.update)
                should.equal(typeof app.models._model.prototype.update, 'function')
                should.exist(app.models._model.prototype.expose)
                should.equal(typeof app.models._model.prototype.expose, 'function')
            })

            describe('app.models.user methods', function () {
                it('should expose model correctly', function () {
                    let data = {firstname: 'toto', lastname: 'tata', phone: '123456789', email: 'qsdqsd@qsdqd.com'}
                    let user = new app.models.user(data)
                    let publicExposer = {firstname: 'toto', lastname: 'tata'}
                    should.deepEqual(publicExposer, user.expose('public'))

                    let loggedExposer = {firstname: 'toto', lastname: 'tata', phone: '123456789', email: 'qsdqsd@qsdqd.com'}
                    should.deepEqual(loggedExposer, user.expose('logged'))
                })
            })
        })
    })
})
