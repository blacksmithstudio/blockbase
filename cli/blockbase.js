#!/usr/bin/env node

const program = require('commander')
const pjson = require('../package.json')

console.log(
    '___.   .__                 __   ___.                         \n' +
    '\\_ |__ |  |   ____   ____ |  | _\\_ |__ _____    ______ ____  \n' +
    ' | __ \\|  |  /  _ \\_/ ___\\|  |/ /| __ \\\\__  \\  /  ___// __ \\ \n' +
    ' | \\_\\ \\  |_(  <_> )  \\___|    < | \\_\\ \\/ __ \\_\\___ \\\\  ___/ \n' +
    ' |___  /____/\\____/ \\___  >__|_ \\|___  (____  /____  >\\___  >\n' +
    '     \\/                 \\/     \\/    \\/     \\/     \\/     \\/ \n' +
    ' Super light Framework by Bl4ck$m1th\n'
)

program
    .command('add <type> [name]')
    .action(function (type, name) {
        let add = require(`./commands/add`)()
        if (!add[type])
            return console.error(`Invalid type entered '${type}'`)
        add[type](name)
    })

program
    .command('create <name>')
    .action(function (name) {
        require(`./commands/create`)().init(name)
    })

program
    .version(pjson.version, '-v, --version')
    .action(function (options, command) {
        console.log(options)
    })
    .parse(process.argv)