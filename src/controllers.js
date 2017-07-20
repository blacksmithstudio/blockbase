const fs = require('fs')
const junk = require('junk')

/**
 * Blockbase Controllers builder
 * @namespace app.controllers.*
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 * @param {string} path - optional path to target the source path
 *
 * @returns {Object} updated controllers namespace
 */
module.exports = (app, path = `${app.root}/controllers/`) => {
    /**
     * index the controllers
     * @private
     * @param {string} file - file to index
     * @param {number} index - position of the file in its parent folder
     *
     * @returns {Object} update controllers namespace
     */
    function index(file, index) {
        if(!file.includes('.js') && !!fs.readdirSync(path + file).length){
            let files = fs.readdirSync(path + file)
            if((typeof files ==='undefined' || files.length <= 0) && app.controllers[file].init)
                return app.controllers[file].init()

            if(!app.controllers[file]) app.controllers[file] = {}

            files.forEach((f, i) => {
                const sub = f.replace('.js', '')
                app.controllers[file][sub] = require(`${path}${file}/${sub}`)(app)

                if(app.controllers[file][sub].init){
                    app.drivers.logger.log('Controllers', `Initializing >> app.controllers.${file}.${sub}.*`)
                    app.controllers[file][sub].init()
                }
            })
        } else {
            app.controllers[file] = require(path + file)(app)
            if(app.controllers[file].init){
                app.drivers.logger.log('Controllers', `Initializing >> app.controllers.${file}.*`)
                app.controllers[file].init()
            }
        }
    }

    return {
        /**
         * main builder
         * @public
         * @async
         * @memberof app.controllers
         *
         * @returns {Object} update controllers namespace
         */
        async build() {
            if(fs.existsSync(path)){
                let files = fs.readdirSync(path).filter(junk.not)
                files.forEach(index)
            }

            return app.controllers
        }
    }
}
