#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')

module.exports = () => {
    /**
     * renaming method, applying the new name to foo.js templates
     * @private
     * @async
     * @param {string} path - path to the model file
     * @param {string} file - file to modify
     * @param {string} name - new name to apply
     * 
     * @returns {string} new file saved
     */
    async function rename(path, file, name){
        name = name.toLowerCase()
        fs.renameSync(`${path}/${file}`, `${path}/${name}.js`)

        let content = fs.readFileSync(`${path}/${name}.js`, 'utf8')
        content = content.replace(/Foo/g, name.charAt(0).toUpperCase() + name.slice(1))
        content = content.replace(/foo/g, name)

        fs.writeFileSync(`${path}/${name}.js`, content, 'utf8')
        
        return `${path}/${name}.js`
    }


    return {
        /**
         * model adding method
         * @param {string} name - model's name 
         */
        async model(name){
            let path = `${process.cwd()}/src`

            if(!fs.existsSync(path))
                return console.error(`Can't run the 'add model' command, you should be in a valid Blockbase project`)
            
            if(fs.existsSync(`${path}/models/${name}.js`))
                return console.error(`Can't run the 'add model' command, model already exists`)

            try {
                fse.copySync(`${__dirname}/../templates/models`, `${path}/models`)

                await rename(`${path}/models`, `foo.js`, name)
                await rename(`${path}/models/exposers`, `foo.js`, name)
                await rename(`${path}/models/schemas`, `foo.js`, name)
                
                console.log(`[ Success ] - Added Model ${name} !`)
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * controller adding method
         * @param {string} name - controller's name 
         */
        async controller(name){
            let path = `${process.cwd()}/src`

            if(!fs.existsSync(path))
                return console.error(`Can't run the 'add controller' command, you should be in a valid Blockbase project`)
            
            path = `${path}/controllers`

            // sub-folder exception
            if(name.includes('.')){
                path = `${path}/${name.split('.')[0]}` 
                name = name.split('.')[1]
                if(!fs.existsSync(path)) fs.mkdirSync(path)
            }

            if(fs.existsSync(`${path}/${name}.js`))
                return console.error(`Can't run the 'add controller' command, controller already exists`)

            try {
                fse.copySync(`${__dirname}/../templates/controllers`, `${path}`)
                await rename(`${path}`, `foo.js`, name)
                
                console.log(`[ Success ] - Added Controller ${name} !`)
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * driver adding method
         * @param {string} name - controller's name 
         */
        async driver(name){
            let path = `${process.cwd()}/src`

            if(!fs.existsSync(path))
                return console.error(`Can't run the 'add driver' command, you should be in a valid Blockbase project`)
            
            path = `${path}/drivers`

            if(fs.existsSync(`${path}/${name}.js`))
                return console.error(`Can't run the 'add driver' command, driver already exists`)

            try {
                fse.copySync(`${__dirname}/../templates/drivers`, `${path}`)
                await rename(`${path}`, `foo.js`, name)
                
                console.log(`[ Success ] - Added Driver ${name} !`)
            } catch (err) {
                console.error(err)
            }
        }
    }
}