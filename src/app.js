const config = require('config')

/**
 * Blockbase Main Instance (app.*)
 * @namespace app.*
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} options - setup options { root : __dirname }
 * @param {function} callback - main callback transporting the app variable
 */
module.exports = async (options, callback) => {
    let app = {
        root : options.root || __dirname,
        config
    }

    app.drivers = require('./drivers')(app)
    app.models = require('./models')(app)
    app.controllers = require('./controllers')(app)

    await app.drivers.build(`${__dirname}/drivers`)
    await app.models.build(`${__dirname}/models`)

    await app.drivers.build()
    await app.models.build()
    await app.controllers.build()

    callback(app)
}
