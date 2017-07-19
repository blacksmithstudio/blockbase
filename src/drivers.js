const fs = require('fs')
const npm = require('npm')
const junk = require('junk')

module.exports = (app) => {
    return {
        async build(path = `${app.root}/drivers`) {
            npm.load(function(err, npm) {
                npm.commands.ls([], true, (err, data, lite) => {
                    // for(let k in data.dependencies)
                    //     console.log(k)
                })
            })

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
