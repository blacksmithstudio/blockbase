#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')
const execSync = require('child_process').execSync

module.exports = () => {
    return {
        init(name='blockbase_app'){
            let path = `${process.cwd()}/${name}`
            
            if(fs.existsSync(path)) 
                return console.log(`[ Error ] - Blockbase can't create, the directory '${name}' already exists. Stopping...`)
            
            try {
                fse.copySync(`${__dirname}/../templates/app`, path)
                fs.renameSync(`${path}/gitignore`, `${path}/.gitignore`)
                
                let package = fs.readFileSync(`${path}/package.json`, 'utf8')
                fs.writeFileSync(`${path}/package.json`, package.replace(/{{ name }}/g, name), 'utf8')

                console.log(`[ Success ] - Application Boilerplate ready !`)
                console.log(`[ Info ] - Install npm dependencies & launching ...`)
                this.run(path)
            } catch (err) {
                console.error(err)
            }
        },

        run(path){
            console.log(execSync(`cd ${path} && npm i && node .`, {
                encoding: 'utf8',
                stdio : [0,1,2]
            }))
        }
    }
}