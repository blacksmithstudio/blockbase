const fs = require('fs')
const junk = require('junk')

module.exports = (app, path = `${app.root}/controllers/`) => {
    function index(file, index) {
        if(!file.includes('.js') && !!fs.readdirSync(path + file).length){
            let files = fs.readdirSync(path + file)
            if((typeof files ==='undefined' || files.length <= 0) && app.controllers[file].init)
                return app.controllers[file].init()

            if(!app.controllers[file]) app.controllers[file] = {}

            files.forEach((f, i) => {
                const sub = f.replace('.js', '')
                app.controllers[file][sub] = require(`${path}${file}/${sub}`)(app)

                if(app.controllers[file][sub].init){
                    app.drivers.logger.log('Controllers', `Initializing >> app.controllers.${file}.${sub}.*`)
                    app.controllers[file][sub].init()
                }
            })
        } else {
            app.controllers[file] = require(path + file)(app)
            if(app.controllers[file].init){
                app.drivers.logger.log('Controllers', `Initializing >> app.controllers.${file}.*`)
                app.controllers[file].init()
            }
        }
    }

    return {
        async build() {
            if(fs.existsSync(path)){
                let files = fs.readdirSync(path).filter(junk.not)
                files.forEach(index)
            }

            return app.controllers
        }
    }
}
