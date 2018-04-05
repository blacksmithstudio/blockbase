#!/usr/bin/env node

const program = require('commander')

console.log(
    '___.   .__                 __   ___.                         \n'+
    '\\_ |__ |  |   ____   ____ |  | _\\_ |__ _____    ______ ____  \n'+
    ' | __ \\|  |  /  _ \\_/ ___\\|  |/ /| __ \\\\__  \\  /  ___// __ \\ \n'+
    ' | \\_\\ \\  |_(  <_> )  \\___|    < | \\_\\ \\/ __ \\_\\___ \\\\  ___/ \n'+
    ' |___  /____/\\____/ \\___  >__|_ \\|___  (____  /____  >\\___  >\n'+
    '     \\/                 \\/     \\/    \\/     \\/     \\/     \\/ \n'+
    ' Super light Framework by Bl4ck$m1th\n'
)

program
    .arguments('<command> [name]')
    .option('-n, --name <name>', 'Application Name & Directory be created')
    .action(function(command, name) {
        console.log(`command : ${command}`)

        require(`./commands/${command}`)().init(name)
    })
    .parse(process.argv)