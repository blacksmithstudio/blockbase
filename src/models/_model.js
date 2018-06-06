const _ = require('underscore')
const Joi = require('joi')
const knex = require('knex')
const knex_clients = {postgresql: 'pg', mysql: 'mysql'}
const fs = require('fs')
const path = require('path')

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
        constructor(options) {
            const {type, authenticated, index, dbms, table} = options
            this.params = {type, index, table}
            this.authenticated = authenticated || false
            this.schema = require(`${app.root}/models/schemas/${type}`)
            this.data = {}

            this.dbms = dbms || app.config.dbms

            if (!this.dbms || !app.drivers[this.dbms])
                Logger.warn('Models', `Missing or problem with DBMS with model '${type}'`)

            if (this.dbms) {
                this.client = app.drivers[this.dbms]
                this.queryBuilder = knex({
                    client: knex_clients[this.dbms],
                    connection: app.config[this.dbms]
                })(table || `${type}s`)
            }
        }

        /**
         * expose the model to a certain filter (exposer)
         * @param {string} type - exposure type
         * @returns {Object} filtered data
         */
        expose(type) {
            let exposerPath = path.join(app.root, `/models/exposers/`)
            if (!fs.existsSync(exposerPath))
                return Logger.error('Model', `missing exposers directory, can't expose`)
            let exposer = require(path.join(exposerPath, this.params.type))

            if (!exposer)
                return Logger.error('Model', `missing exposer on model type '${type}', can't expose`)

            if(!exposer[type])
                return Logger.error('Model', `missing exposer on ${this.params.type} model : '${type}', can't expose`)
            let data = {}
            exposer[type].map(k => data[k] = this.data[k])
            return data
        }

        /**
         * body getter - omit methods and private variables
         * @param {Object} data - optional data to push in the body of model
         * @returns {Object} body data
         */
        body(data) {
            if (!data) {
                return _.omit(this.data, (value, key, object) => {
                    return _.isFunction(value) || _.isNull(value) || key.charAt(0) === '_'
                })
            } else {
                this.data = Object.assign(this.data, data)
                return this.data
            }
        }

        /**
         * clean the null values from the current object
         * @returns {Object} body data cleaned
         */
        clean() {
            this.data = _.omit(this.data, (value, key, object) => {
                return _.isNull(value) || value === ''
            })
        }

        /**
         * is the model data valid
         * @returns {boolean} body is valid
         */
        valid() {
            return this.validate().error === null ? true : false
        }

        /**
         * validate the data
         * @returns {Object} validation details (from Joi)
         */
        validate() {
            const validation = Joi.validate(this.body(), this.schema)

            if (!validation.error)
                _.extendOwn(this.data, validation.value)

            return validation
        }

        /**
         * read info from DB
         */
        async read() {
            try {
                return await this.client.read(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * update info in DB
         */
        async update() {
            try {
                return await this.client.update(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * save info in DB (update or create)
         * @param {function} cb - callback returning the item saved
         */
        async save() {
            try {
                return await this.client.save(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * delete from DB
         * @param {function} cb - callback returning bool if deleted
         */
        async delete() {
            try {
                return await this.client.delete(this)
            } catch (e) {
                throw e
            }
        }
    }
}
