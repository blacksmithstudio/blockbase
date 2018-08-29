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
            if(path.includes(app.root) && fs.existsSync(`${app.root}/../node_modules`)){
                let modules = fs.readdirSync(`${app.root}/../node_modules`)
                let drivers = modules.filter((mod) => {
                    return mod.includes('blockbase-')
                })

                for(let i = 0; i < drivers.length; i++){
                    if(!app.drivers[drivers[i].replace('blockbase-', '')])
                        app.drivers[drivers[i].replace('blockbase-', '')] = require(drivers[i])(app)                    
                }
            }

            if(fs.existsSync(path)){
                let files = fs.readdirSync(path).filter(junk.not)

                for(let i = 0; i < files.length; i++){
                    if(files[i].includes('.js'))
                        app.drivers[files[i].replace('.js', '')] = require(`${path}/${files[i].replace('.js', '')}`)(app)
                }
            }

            return app.drivers
        }
    }
}
