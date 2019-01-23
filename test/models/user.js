module.exports = (app) => {

    return class User extends app.models._model {
        constructor(data) {
            super({ type: 'user', dbms: null })
            if (data)
                this.data = Object.assign({}, data)
        }
    }

}