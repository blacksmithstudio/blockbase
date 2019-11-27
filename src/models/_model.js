const Joi = require('joi')
const knex = require('knex')
const knex_clients = { postgresql: 'pg', mysql: 'mysql', mssql: 'mssql' }
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
         * Main constructor
         * @constructor
         * @param {Object} options - parameters to push in the models
         * @param {String=} options.type - model type name. ex: 'user'
         * @param {Boolean=} options.authenticated - wherever model is authenticated
         * @param {Boolean=} options.index -
         * @param {String=} options.dbms - DBMS to use. Set to null if none is used
         * @param {String=} options.table - DBMS table to use
         */
        constructor(options) {
            const { type, authenticated, index, dbms, table } = options
            this.params = { type, index, table }
            this.authenticated = authenticated || false
            this.schema = require(`${app.root}/models/schemas/${type}`)
            this.data = {}

            this.dbms = dbms || app.config.dbms

            if (this.dbms) {
                if (!app.drivers[this.dbms]) {
                    Logger.warn('Models', `Missing DBMS with model '${type}'`)
                    return
                }

                this.client = app.drivers[this.dbms]
                if(knex_clients[this.dbms]){
                    this.queryBuilder = knex({
                        client: knex_clients[this.dbms],
                        connection: app.config[this.dbms]
                    })(table || `${type}s`)
                    this.queryBuilder
                        .on('query-response', async function (response, query, builder) {
                            builder.client.pool.destroy()
                        })
                    }
            }
        }

        /**
         * Expose the model to a certain filter (exposer)
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

            if (!exposer[type])
                return Logger.error('Model', `missing exposer on ${this.params.type} model : '${type}', can't expose`)
            let data = {}
            exposer[type].map(k => data[k] = this.data[k])
            return data
        }

        /**
         * Body getter - omit methods and private variables
         * @param {Object=} data - optional data to push in the body of model
         * @returns {Object} body data
         */
        body(data) {
            if (!data) {
                return Object
                    .entries(this.data)
                    .reduce((sum, [key, value]) =>
                            (key.charAt(0) === '_' || typeof value === 'function' || value === null)
                                ? sum
                                : { ...sum, [key]: value }
                        , {})
                // return _.omit(this.data, (value, key, object) => {
                //     return _.isFunction(value) || _.isNull(value) || key.charAt(0) === '_'
                // })
            } else {
                this.data = Object.assign(this.data, data)
                return this.data
            }
        }

        /**
         * Clean the null values from the current object
         * @returns {Object} body data cleaned
         */
        clean() {

            this.data = Object
                .entries(this.data)
                .reduce((sum, [key, value]) => (value === '' || value === null)
                    ? sum
                    : { ...sum, [key]: value }
                    , {})
            /*this.data = _.omit(this.data, (value, key, object) => {
             return _.isNull(value) || value === ''
             })*/
        }

        /**
         * Is the model data valid
         * @returns {boolean} body is valid
         */
        valid() {
            return this.validate().error === null
        }

        /**
         * Validate the data
         * @returns {Object} validation details (from Joi)
         */
        validate() {
            const validation = Joi.validate(this.body(), this.schema)

            if (!validation.error)
                this.data = { ...this.data, ...validation.value }

            return validation
        }

        /**
         * Read info from DB
         */
        async read() {
            try {
                return await this.client.read(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * Triggered before an update
         * @return {Promise<void>}
         */
        async beforeUpdate() {
            //Overide this function to have your code executed before the update method is called
        }

        /**
         * Update info in DB
         * @return {Promise<{Model}>}
         */
        async update() {
            try {
                await this.beforeUpdate()
                return await this.client.update(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * Triggered before a save
         * @return {Promise<void>}
         */
        async beforeSave() {
            //Overide this function to have your code executed before the save method is called
        }

        /**
         * Save model info in DB (update or create depending on DBMS)
         * @return {Promise<{Model}>}
         */
        async save() {
            try {
                await this.beforeSave()
                return await this.client.save(this)
            } catch (e) {
                throw e
            }
        }

        /**
         * Triggered before a delete
         * @return {Promise<void>}
         */
        async beforeDelete() {
            //Overide this function to have your code executed before the delete method is called
        }

        /**
         * Delete from DB - returns a boolean if deleted
         * @return {Promise<{Boolean}>}
         */
        async delete() {
            try {
                await this.beforeDelete()
                return await this.client.delete(this)
            } catch (e) {
                throw e
            }
        }
    }
}
