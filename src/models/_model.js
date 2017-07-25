const _ = require('underscore')
const Joi = require('joi')

/**
 * Blockbase Main Model (class)
 * @memberof app.models
 * @namespace app.models._models
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace
 *
 * @returns {function} class object
 */
module.exports = (app) => {
    return class Model {
        /**
         * main constructor
         * @constructor
         * @param {Object} options - parameters to push in the models
         */
        constructor(options){
            const { type, authenticated, index, dbms } = options

            this.authenticated = authenticated || false

            if(!app.config.dbms || !app.drivers[app.config.dbms])
                app.drivers.logger.warn('Models', `Missing or problem with DBMS with model '${type}'`)

            this.client = app.drivers[dbms || app.config.dbms]
            this.params = { type, index }

            this.schema = require(`${app.root}/models/schemas/${type}`)
            this.data = {}
        }

        /**
         * body getter - omit methods and private variables
         * @param {Object} data - optional data to push in the body of model
         * @returns {Object} body data
         */
        body(data){
            if(!data){
                return _.omit(this.data, (value, key, object) => {
                    return _.isFunction(value) || key.charAt(0) === '_'
                })
            } else {
                return _.extendOwn(this.data, data)
            }
        }

        /**
         * is the model data valid
         * @returns {boolean} body is valid
         */
        valid(){
            return this.validate().error === null ? true : false
        }

        /**
         * validate the data
         * @returns {Object} validation details (from Joi)
         */
        validate(){
            const validation = Joi.validate(this.body(), this.schema)

            if(!validation.error)
                _.extendOwn(this.data, validation.value)

            return validation
        }

        /**
         * read info from DB
         * @param {Object} opt - options to pass
         * @param {function} cb - callback returning the item created
         */
        read(opt, cb) {
            this.client.read(this, opt, cb)
        }

        /**
         * update info in DB
         * @param {Object} data - update to pass
         * @param {function} cb - callback returning the item updated
         */
        update(cb) {
            this.client.update(this, cb)
        }

        /**
         * save info in DB (update or create)
         * @param {function} cb - callback returning the item saved
         */
        save(cb) {
            this.client.save(this, cb)
        }

        /**
         * delete from DB
         * @param {function} cb - callback returning bool if deleted
         */
        delete(cb) {
            this.client.delete(this, cb)
        }
    }
}
