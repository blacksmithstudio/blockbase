const fs = require('fs')

/**
 * Blockbase Models builder
 * @namespace app.models.*
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} updated models namespace
 */
module.exports = (app) => {
    return {
        /**
         * main builder
         * @public
         * @async
         * @memberof app.models
         *
         * @returns {Object} update models namespace
         */
        async build(path = `${app.root}/models`){
            if(fs.existsSync(path)){
                let files = fs.readdirSync(path)

                files.forEach((f, i) => {
                    if(f.includes('.js'))
                        app.models[f.replace('.js', '')] = require(`${path}/${f.replace('.js', '')}`)(app)
                })
            }

            return app.models
        }
    }
}
