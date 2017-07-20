const _ = require('underscore')
const fs = require('fs')
const junk = require('junk')
const path = require('path')

module.exports = (app) => {
    return {
        async build(path = `${app.root}/drivers`) {
            if(fs.existsSync(`${app.root}/../node_modules/@blacksmithstudio`)){
                let modules = fs.readdirSync(`${app.root}/../node_modules/@blacksmithstudio`)
                let drivers = _.filter(modules, (mod) => {
                    return mod.includes('blockbase-')
                })

                drivers.forEach((driver, idx) => {
                    if(!app.drivers[driver.replace('blockbase-', '')])
                        app.drivers[driver.replace('blockbase-', '')] = require(`@blacksmithstudio/${driver}`)(app)
                })
            }

            if(fs.existsSync(path)){
                let files = fs.readdirSync(path).filter(junk.not)

                files.forEach((f, i) => {
                    if(f.includes('.js'))
                        app.drivers[f.replace('.js', '')] = require(`${path}/${f.replace('.js', '')}`)(app)
                })
            }

            return app.drivers
        }
    }
}
