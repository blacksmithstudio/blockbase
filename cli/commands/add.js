#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')

module.exports = () => {
    return {
        /**
         * model adding method
         * @param {string} name - model's name 
         */
        model(name){
            let path = `${process.cwd()}/src`

            if(!fs.existsSync(path))
                return console.error(`Can't run the 'add model' command, you should be in a valid Blockbase project`)
            
            if(fs.existsSync(`${path}/models/${name}.js`))
                return console.error(`Can't run the 'add model' command, model already exists`)

            try {
                fse.copySync(`${__dirname}/../templates/models`, `${path}/models`)
                fs.renameSync(`${path}/models/foo.js`, `${path}/models/${name}.js`)
                fs.renameSync(`${path}/models/exposers/foo.js`, `${path}/models/exposers/${name}.js`)
                fs.renameSync(`${path}/models/schemas/foo.js`, `${path}/models/schemas/${name}.js`)
                
                console.log(`[ Success ] - Added Model ${name} !`)
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * controller adding method
         * @param {string} name - controller's name 
         */
        controller(name){
            let path = `${process.cwd()}/src`

            if(!fs.existsSync(path))
                return console.error(`Can't run the 'add controller' command, you should be in a valid Blockbase project`)
            
            if(fs.existsSync(`${path}/controllers/${name}.js`))
                return console.error(`Can't run the 'add controller' command, controller already exists`)

            try {
                fse.copySync(`${__dirname}/../templates/controllers`, `${path}/controllers`)
                fs.renameSync(`${path}/controllers/foo.js`, `${path}/controllers/${name}.js`)
                
                console.log(`[ Success ] - Added Controller ${name} !`)
            } catch (err) {
                console.error(err)
            }
        }
    }
}