module.exports = (app) => {
    return {
        error(type = 'unknown', message){
            console.error(`\x1b[31m[Error] - [${type}] - ${message}\x1b[0m`)
        },

        warn(type = 'unknown', message){
            if(app.config.log)
                console.error(`\x1b[33m[Warn] - [${type}] - ${message}\x1b[0m`)
        },

        success(type = 'unknown', message){
            if(app.config.log)
                console.error(`\x1b[32m[Success] - [${type}] - ${message}\x1b[0m`)
        },

        log(type = 'unknown', message){
            if(app.config.log)
                console.error(`\x1b[0m[Log] - [${type}] - ${message}\x1b[0m`)
        }
    }
}
