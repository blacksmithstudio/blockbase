const assert = require('assert')

describe('Initialization of tests', () => {
  it('app presence', () => {
    assert.equal('function', typeof require('../src/app'))
  })
})

require('../src/app')((app) => {
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

        describe(`app.models.* tests`, () => {
            it('app.models.user exists', () => {
                assert.equal('function', typeof app.models.user)
            })
        })

        describe(`app.drivers.* tests`, () => {
            it('app.drivers.aws exists', () => {
                assert.equal('object', typeof new app.drivers.aws.S3())
            })
            it('app.drivers.botkit exists', () => {
                assert.equal('object', typeof app.drivers.botkit.controller)
            })
            it('app.drivers.elasticsearch exists', () => {
                assert.equal('object', typeof app.drivers.elasticsearch.client)
            })
            it('app.drivers.express exists', () => {
                assert.equal('function', typeof app.drivers.express.listen)
            })
            it('app.drivers.genderize exists', () => {
                assert.equal('function', typeof app.drivers.genderize.detect)
            })
            it('app.drivers.memcached exists', () => {
                assert.equal('object', typeof app.drivers.memcached)
            })
            it('app.drivers.security exists', () => {
                assert.equal('function', typeof app.drivers.security.token.encrypt)
            })
            it('app.drivers.slackbot exists', () => {
                assert.equal('object', typeof app.drivers.slackbot.bot)
            })
            it('app.drivers.translate exists', () => {
                assert.equal('function', typeof app.drivers.translate.translate)
            })
        })
    })

    describe('Features', () => {
        it('app.models.user sub-method', () => {
            assert.equal('function', typeof new app.models.user(app).save)
        })
        it('app.models.history sub-method', () => {
            assert.equal('function', typeof new app.models.history(app).save)
        })
        it('app.models.user validation (OK)', () => {
            assert.equal(true, new app.models.user(app, {firstname : 'Alex'}).valid())
        })
        it('app.models.user validation (NOK)', () => {
            assert.equal(false, new app.models.user(app, {firstname : 6788585}).valid())
        })
        it('app.drivers.translate detection', (done) => {
            app.drivers.translate.detect('Hello my name is Robert', (detection) => {
                if(detection.language === 'en')
                    done()
                else
                    done('Not Matching language detection')
            })
        })
        it('app.drivers.language process', (done) => {
            app.memory.language.process({ query : 'hi', user : new app.models.user(app).data }, (language, text, data) => {
                if(text.length > 0)
                    done()
                else
                    done('Error on processing language')
            })
        })
    })
})
