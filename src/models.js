const fs = require('fs')

module.exports = (app) => {
    return {
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
