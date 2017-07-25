const _ = require('underscore')
const fs = require('fs')
const junk = require('junk')
const path = require('path')

/**
 * Blockbase Drivers builder
 * @namespace app.drivers.*
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} updated drivers namespace
 */
module.exports = (app) => {
    return {
        /**
         * main builder
         * @public
         * @async
         * @memberof app.drivers
         *
         * @returns {Object} update drivers namespace
         */
        async build(path = `${app.root}/drivers`) {
            if(fs.existsSync(path)){
                let files = fs.readdirSync(path).filter(junk.not)

                files.forEach((f, i) => {
                    if(f.includes('.js'))
                        app.drivers[f.replace('.js', '')] = require(`${path}/${f.replace('.js', '')}`)(app)
                })
            }

            if(path.includes(app.root) && fs.existsSync(`${app.root}/../node_modules/@blacksmithstudio`)){
                let modules = fs.readdirSync(`${app.root}/../node_modules/@blacksmithstudio`)
                let drivers = _.filter(modules, (mod) => {
                    return mod.includes('blockbase-')
                })

                drivers.forEach((driver, idx) => {
                    if(!app.drivers[driver.replace('blockbase-', '')])
                        app.drivers[driver.replace('blockbase-', '')] = require(`@blacksmithstudio/${driver}`)(app)
                })
            }

            return app.drivers
        }
    }
}
