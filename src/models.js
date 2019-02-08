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

                for(let i=0; i<files.length; i++){
                    if(files[i].includes('.js'))
                        app.models[files[i].replace('.js', '')] = require(`${path}/${files[i].replace('.js', '')}`)(app)
                }
            }

            return app.models
        }
    }
}
