/**
 * Blockbase Shuffle Init File
 * @author Blacksmith <code@blacksmith.studio>
 */

const blockbase = require('@blacksmithstudio/blockbase')

blockbase({ root : __dirname }, async (app) => {
    app.drivers.express.route()
    app.drivers.express.listen()
    // ...
})