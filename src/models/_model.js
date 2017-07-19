const _ = require('underscore')
const Joi = require('joi')
const moment = require('moment')

module.exports = (app) => {
    return class Model {
        constructor(options){
            const { type, authenticated, index } = options

            this.authenticated = authenticated || false

            if(!app.config.dbms || !app.drivers[app.config.dbms])
                app.drivers.logger.warn('Models', `Missing or problem with DBMS with model '${type}'`)

            this.client = app.drivers[app.config.dbms]
            this.params = { type, index }

            this.schema = require(`${app.root}/models/schemas/${type}`)
            this.data = {}
        }

        body(){
            if(!data){
                return _.omit(this.data, (value, key, object) => {
                    return _.isFunction(value) || key.charAt(0) === '_'
                })
            } else {
                return _.extendOwn(this.data, data)
            }
        }

        valid(){
            return this.validate().error === null ? true : false
        }

        validate(){
            const validation = Joi.validate(this.body(), this.schema)

            if(!validation.error)
                _.extendOwn(this.data, validation.value)

            return validation
        }

        read(opt, cb) {
            this.client.read(this, opt, cb)
        }

        update(data, cb) {
            this.client.update(this, data, cb)
        }

        save(cb) {
            this.client.save(this, cb)
        }

        delete(cb) {
            this.client.delete(this, cb)
        }
    }
}
