const Joi = require('joi')
const moment = require('moment')

/**
 * Foo validation schema (with Joi)
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @returns {Object} Joi schema
 */
module.exports = Joi.object().keys({
    id         : Joi.number().integer(),
    firstname  : Joi.string().max(128).optional(),
    lastname   : Joi.string().max(128).optional(),
    created_at : Joi.date().default(() => moment().format(), 'date created'),
    updated_at : Joi.date().default(() => moment().format(), 'date updated'),
})
