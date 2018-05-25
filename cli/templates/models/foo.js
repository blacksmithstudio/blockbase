/**
 * Foo Example model
 * @namespace app.models.foo
 * @author Alexandre Pereira <alex@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} model
 */
module.exports = (app) => {
    const Model = app.models._model

    return class Foo extends Model {
        /**
         * main constructor
         * @param {Object} data - data to param the model
         */
        constructor(data) {
            super({type: 'foo', authenticated: false})

            if (data)
                this.data = data
        }
    }
}
