/**
 * Blockbase Logger (Driver)
 * @memberof app.drivers
 * @namespace app.drivers.logger
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace
 *
 * @returns {Object} app.drivers.logger object with methods
 */
module.exports = (app) => {
    return {
        /**
         * error logger
         * @param {string} type - type of message
         * @param {string} error - message to display
         */
        error(type = 'unknown', error) {
            console.error.apply(console, [`\x1b[31m[Error] - [${type}]`, error, `\x1b[0m`])
        },

        /**
         * warning logger
         * @param {string} type - type of message
         * @param {string} message - message to display
         */
        warn(type = 'unknown', message = '') {
            if (app.config.log)
                console.warn(`\x1b[33m[Warn] - [${type}] - ${message}\x1b[0m`)
        },

        /**
         * success logger
         * @param {string} type - type of message
         * @param {string} message - message to display
         */
        success(type = 'unknown', message = '') {
            if (app.config.log)
                console.log(`\x1b[32m[Success] - [${type}] - ${message}\x1b[0m`)
        },

        /**
         * log logger
         * @param {string} type - type of message
         * @param args
         */
        log(type = 'unknown', ...args) {

            if (app.config.log)
                console.log.apply(console, [`\x1b[0m[Log] - [${type}]`].concat(args).concat([`\x1b[0m`]))
        }
    }
}
