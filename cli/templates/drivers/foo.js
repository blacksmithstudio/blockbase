/**
 * Foo Example driver
 * @namespace app.drivers.foo
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} driver
 */
module.exports = (app) => {
    const Logger = app.drivers.logger
    // init the driver

    return {
        /**
         * example method in the app.drivers.foo namespace
         */
        bar(){
            Logger.log('Driver example', 'running app.drivers.foo.bar() driver method')
        }
    }
}
