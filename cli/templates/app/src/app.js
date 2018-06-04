/**
 * Blockbase Init File
 * @author Blacksmith <code@blacksmith.studio>
 */

const blockbase = require('blockbase')

blockbase({ root : __dirname }, async (app) => {
    app.drivers.express.route()
    app.drivers.express.listen()
    // ...
})