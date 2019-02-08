#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')
const execSync = require('child_process').execSync

module.exports = () => {
    return {
        /**
         * init the application
         * @param {string} name - model's name 
         */
        init(name='blockbase_app'){
            let path = `${process.cwd()}/${name}`

            if(fs.existsSync(path)) 
                return console.log(`[ Error ] - Blockbase can't create, the directory '${name}' already exists. Stopping...`)
            
            try {
                fse.copySync(`${__dirname}/../templates/app`, path)
                fs.renameSync(`${path}/gitignore`, `${path}/.gitignore`)
                
                let pck = fs.readFileSync(`${path}/package.json`, 'utf8')
                fs.writeFileSync(`${path}/package.json`, pck.replace(/{{ name }}/g, name), 'utf8')

                console.log(`[ Success ] - Application Boilerplate ready !`)
                console.log(`[ Info ] - Install npm dependencies & launching ...`)
                this.run(path)
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * model adding method
         * @async
         * @param {string} path - current application path 
         */
        run(path){
            let output = execSync(`cd ${path} && npm i && node .`, {
                encoding: 'utf8',
                stdio : [0,1,2]
            })
            console.log(output)
        }
    }
}