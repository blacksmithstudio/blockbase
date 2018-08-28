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

    console.log(
        '___.   .__                 __   ___.                         \n'+
        '\\_ |__ |  |   ____   ____ |  | _\\_ |__ _____    ______ ____  \n'+
        ' | __ \\|  |  /  _ \\_/ ___\\|  |/ /| __ \\\\__  \\  /  ___// __ \\ \n'+
        ' | \\_\\ \\  |_(  <_> )  \\___|    < | \\_\\ \\/ __ \\_\\___ \\\\  ___/ \n'+
        ' |___  /____/\\____/ \\___  >__|_ \\|___  (____  /____  >\\___  >\n'+
        '     \\/                 \\/     \\/    \\/     \\/     \\/     \\/ \n'+
        ' Super light Framework by Bl4ck$m1th\n'
    )
    console.log('[Info] - Begin initialization...\n')

    app.drivers = require('./drivers')(app)
    app.models = require('./models')(app)
    app.controllers = require('./controllers')(app)

    await app.drivers.build(`${__dirname}/drivers`)
    await app.models.build(`${__dirname}/models`)

    await app.drivers.build()
    await app.models.build()
    await app.controllers.build()

    app.drivers.logger.success('App', `${app.config.name} is alive !`)
    
    if(callback)
        return callback(app)

    return app
}
