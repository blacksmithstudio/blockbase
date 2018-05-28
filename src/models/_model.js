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
    const Logger = app.drivers.logger 

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
                Logger.warn('Models', `Missing or problem with DBMS with model '${type}'`)

            this.client = app.drivers[dbms || app.config.dbms]
            this.params = { type, index }

            this.schema = require(`${app.root}/models/schemas/${type}`)
            this.data = {}
        }

        /**
         * expose the model to a certain filter (exposer)
         * @param {string} type - exposure type
         * @returns {Object} filtered data
         */
        expose(type) {
            let path = `./exposers/${this.params.type}`
            if(`./exposers/` || !fs.existsSync(path))
                return Logger.error('Model', `missing exposer on type '${type}', can't expose`)

            let exposer = require(path)[type]
            let data = {}

            exposer.forEach((key, idx) => objectPath.set(data, key, objectPath.get(this.data, key)))
            return data
        }

        /**
         * body getter - omit methods and private variables
         * @param {Object} data - optional data to push in the body of model
         * @returns {Object} body data
         */
        body(data){
            if(!data){
                return _.omit(this.data, (value, key, object) => {
                    return _.isFunction(value) || _.isNull(value) || key.charAt(0) === '_'
                })
            } else {
                return _.extendOwn(this.data, data)
            }
        }

        /**
         * clean the null values from the current object
         * @returns {Object} body data cleaned
         */
        clean(){
            this.data = _.omit(this.data, (value, key, object) => {
                return _.isNull(value) || value === ''
            })
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
         */
        async read() {
            try{
                return await this.client.read(this)
            } catch(e) { throw e }
        }

        /**
         * update info in DB
         */
        async update() {
            try{
                return await this.client.update(this)
            } catch(e) { throw e }
        }

        /**
         * save info in DB (update or create)
         * @param {function} cb - callback returning the item saved
         */
        async save() {
            try{
                return await this.client.save(this)
            } catch(e) { throw e }
        }

        /**
         * delete from DB
         * @param {function} cb - callback returning bool if deleted
         */
        async delete() {
            try{
                return await this.client.delete(this)
            } catch(e) { throw e }
        }
    }
}
