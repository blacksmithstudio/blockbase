/**
 * Foo Example controller
 * @namespace app.controllers.foo
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} controller
 */
module.exports = (app) => {
    const Logger = app.drivers.logger
    // init the namespace

    return {
        /**
         * example method in the app.controllers.foo namespace
         */
        bar(){
            Logger.log('Controller example', 'running app.controllers.foo.bar() controller method')
        }
    }
}
